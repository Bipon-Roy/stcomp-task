import { connectDB } from "../db/db";
import { MediaType, MimeType, VerificationStatus } from "../entities/enums/specialist.enum";
import { Media } from "../entities/Media.entity";
import { Specialist } from "../entities/Specialist.entity";
import { GetAllSpecialistsParams, PublishedSpecialistCard, SpecialistListItem } from "../types";
import { ApiError } from "../utils/apiError";
import { removeImageFromCloud, uploadOnCloudinary } from "../utils/cloudinary";
import { compressImage } from "../utils/imageCompressor";
import { applyEnumFilter, applySearch, applySort, buildMeta, normalizePageLimit } from "../utils/queryBuilder";
import { CreateSpecialistBody, UpdateSpecialistBody } from "../validators/specialist.validator";

function slugify(input: string) {
    return input
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

async function buildUniqueSlug(repo: any, title: string) {
    const base = slugify(title) || "specialist";
    let slug = base;
    let n = 1;

    while (await repo.findOne({ where: { slug } })) {
        n += 1;
        slug = `${base}-${n}`;
    }

    return slug;
}

export class SpecialistServices {
    static async getAllSpecialist(params: GetAllSpecialistsParams) {
        const db = await connectDB();
        const repo = db.getRepository(Specialist);

        const { page, limit } = normalizePageLimit(params.page ?? 1, params.limit ?? 10);

        // Join only ONE media row (thumbnail) to avoid duplicates
        const qb = repo
            .createQueryBuilder("s")
            .leftJoin(
                Media,
                "thumb",
                `
          thumb.specialists = s.id
          AND thumb.deleted_at IS NULL
          AND thumb.display_order = 0
          AND thumb.media_type = 'image'
        `
            )
            .where("s.deleted_at IS NULL");

        // tab filter (Drafts / Published)
        if (params.tab === "drafts") qb.andWhere("s.is_draft = true");
        if (params.tab === "published") qb.andWhere("s.is_draft = false");

        // search
        applySearch(qb, {
            term: params.search,
            columns: ["s.title", "s.slug"],
            paramName: "search",
        });

        // verification status filter (approval status)
        applyEnumFilter(qb, {
            value: params.status,
            column: "s.verification_status",
            allowed: Object.values(VerificationStatus),
            paramName: "vstatus",
        });

        // sorting (whitelisted)
        applySort(qb, {
            sortBy: params.sortBy,
            order: params.order,
            allowed: {
                created_at: "s.created_at",
                price: "s.final_price",
                duration: "s.duration_days",
                purchases: "s.total_number_of_ratings", // temp
            },
            defaultSort: { column: "s.created_at", order: "DESC" },
        });

        // count BEFORE pagination
        const total = await qb.clone().getCount();

        // pagination
        const offset = (page - 1) * limit;
        qb.offset(offset).limit(limit);

        // select only what you need for the UI table
        const rows = await qb
            .select([
                "s.id AS id",
                "s.title AS title",
                "s.final_price AS price",
                "s.total_number_of_ratings AS purchases",
                "s.duration_days AS duration_days",
                "s.verification_status AS verification_status",
                "s.is_draft AS is_draft",
                "s.created_at AS created_at",
                "thumb.file_name AS thumbnail_url",
            ])
            .getRawMany<{
                id: string;
                title: string;
                price: string;
                purchases: number;
                duration_days: number;
                verification_status: VerificationStatus;
                is_draft: boolean;
                created_at: Date;
                thumbnail_url: string | null;
            }>();

        const items: SpecialistListItem[] = rows.map((r) => ({
            id: r.id,
            title: r.title,
            price: r.price,
            purchases: Number(r.purchases ?? 0), // NOTE: replace when you have real purchases table
            durationDays: Number(r.duration_days ?? 0),
            approvalStatus: r.verification_status,
            publishStatus: r.is_draft ? "Not Published" : "Published",
            thumbnailUrl: r.thumbnail_url ?? null,
            createdAt: new Date(r.created_at),
        }));

        return {
            items,
            meta: buildMeta(page, limit, total),
        };
    }
    static async getPublishedSpecialist(): Promise<PublishedSpecialistCard[]> {
        const db = await connectDB();
        const repo = db.getRepository(Specialist);

        const rows = await repo
            .createQueryBuilder("s")
            .leftJoin(
                Media,
                "thumb",
                `
            thumb.specialists = s.id
            AND thumb.deleted_at IS NULL
            AND thumb.display_order = 0
            AND thumb.media_type = 'image'
        `
            )
            .where("s.deleted_at IS NULL")
            .andWhere("s.is_draft = false")
            .select([
                "s.id AS id",
                "s.title AS title",
                "s.base_price AS base_price",
                "thumb.file_name AS thumbnail_url",
            ])
            .orderBy("s.created_at", "DESC")
            .getRawMany<{
                id: string;
                title: string;
                base_price: string;
                thumbnail_url: string | null;
            }>();

        return rows.map((r) => ({
            id: r.id,
            title: r.title,
            basePrice: r.base_price,
            thumbnailUrl: r.thumbnail_url ?? null,
        }));
    }
    static async getAllSpecialistById(id: string) {
        const db = await connectDB();
        const repo = db.getRepository(Specialist);

        const rows = await repo
            .createQueryBuilder("s")
            .leftJoin(
                Media,
                "m",
                `
            m.specialists = s.id
            AND m.deleted_at IS NULL
            AND m.media_type = 'image'
        `
            )
            .where("s.id = :id", { id })
            .andWhere("s.deleted_at IS NULL")
            .select([
                "s.id AS s_id",
                "s.title AS s_title",
                "s.slug AS s_slug",
                "s.description AS s_description",
                "s.final_price AS s_price",
                "s.duration_days AS s_duration_days",
                "s.verification_status AS s_verification_status",
                "s.is_draft AS s_is_draft",
                "s.created_at AS s_created_at",

                "m.id AS m_id",
                "m.file_name AS m_file_name",
                "m.display_order AS m_display_order",
            ])
            .getRawMany<{
                s_id: string;
                s_title: string;
                s_slug: string;
                s_description: string | null;
                s_price: string;
                s_duration_days: number;
                s_verification_status: VerificationStatus;
                s_is_draft: boolean;
                s_created_at: Date;

                m_id: string | null;
                m_file_name: string | null;
                m_display_order: number | null;
            }>();

        if (!rows.length) {
            throw new ApiError(404, "Specialist not found");
        }

        const base = rows[0];

        const media = rows
            .filter((r) => r.m_id)
            .map((r) => ({
                id: r.m_id!,
                fileName: r.m_file_name!,
                displayOrder: Number(r.m_display_order ?? 0),
            }))
            .sort((a, b) => a.displayOrder - b.displayOrder);

        return {
            id: base.s_id,
            title: base.s_title,
            slug: base.s_slug,
            description: base.s_description,
            price: base.s_price,
            durationDays: Number(base.s_duration_days ?? 0),
            approvalStatus: base.s_verification_status,
            publishStatus: base.s_is_draft ? "Not Published" : "Published",
            createdAt: new Date(base.s_created_at),
            media: media.map((m) => m.fileName),
        };
    }

    static async createSpecialist(data: CreateSpecialistBody, files: Express.Multer.File[]): Promise<string> {
        if (!files || files.length !== 3) {
            throw new ApiError(400, "Exactly 3 images are required");
        }

        const db = await connectDB();

        return await db.transaction(async (manager) => {
            const specialistRepo = manager.getRepository(Specialist);
            const mediaRepo = manager.getRepository(Media);

            const statusMap: Record<CreateSpecialistBody["status"], VerificationStatus> = {
                "under-review": VerificationStatus.UNDERREVIEW,
                approved: VerificationStatus.APPROVED,
                rejected: VerificationStatus.REJECTED,
            };

            const basePrice = data.price;

            const platformFee = "0";
            const finalPrice = basePrice;

            // slug is required and unique
            const slug = await buildUniqueSlug(specialistRepo, data.title);

            // Create Specialist with correct entity fields
            const specialist = specialistRepo.create({
                title: data.title,
                slug,
                description: data.description,
                is_draft: true,
                duration_days: data.estimatedDays,
                base_price: basePrice,
                platform_fee: platformFee,
                final_price: finalPrice,
                verification_status: statusMap[data.status],
                is_verified: data.status === "approved",
            });

            // saved is a single Specialist
            const saved = await specialistRepo.save(specialist);

            let mediaRows: Media[];

            try {
                mediaRows = await Promise.all(
                    files.map(async (file, i) => {
                        const compressedPath = await compressImage(file.path);
                        const cloudRes = await uploadOnCloudinary(compressedPath);

                        if (!cloudRes?.secure_url) {
                            throw new ApiError(400, `Error uploading image ${file.originalname}`);
                        }

                        return mediaRepo.create({
                            specialists: saved.id,
                            file_name: cloudRes.secure_url,
                            file_id: cloudRes.public_id,
                            file_size: file.size,
                            display_order: i,
                            mime_type: file.mimetype as MimeType,
                            media_type: MediaType.IMAGE,
                            uploaded_at: new Date(),
                        });
                    })
                );
            } catch (error) {
                throw new ApiError(500, `Image upload failed: ${(error as Error).message}`);
            }

            await mediaRepo.save(mediaRows);

            return saved.id;
        });
    }

    static async publishSpecialist(serviceId: string): Promise<string> {
        const db = await connectDB();

        const specialistRepo = db.getRepository(Specialist);

        const specialist = await specialistRepo.findOne({
            where: { id: serviceId },
        });

        if (!specialist) {
            throw new ApiError(404, "Service not found");
        }
        if (!specialist.is_draft) {
            throw new ApiError(400, "Service is already published");
        }

        specialist.is_draft = false;

        await specialistRepo.save(specialist);

        return specialist.id;
    }

    static async updateSpecialist(
        specialistId: string,
        data: UpdateSpecialistBody,
        filesByField: Record<string, Express.Multer.File[]>
    ) {
        const db = await connectDB();

        const statusMap: Record<UpdateSpecialistBody["status"], VerificationStatus> = {
            "under-review": VerificationStatus.UNDERREVIEW,
            approved: VerificationStatus.APPROVED,
            rejected: VerificationStatus.REJECTED,
        };

        // identify which image slots were sent
        const slotDefs = [
            { key: "image0", order: 0 },
            { key: "image1", order: 1 },
            { key: "image2", order: 2 },
        ] as const;

        const changedSlots = slotDefs
            .map((s) => ({
                order: s.order,
                file: filesByField?.[s.key]?.[0],
            }))
            .filter((x) => !!x.file) as { order: 0 | 1 | 2; file: Express.Multer.File }[];

        return await db.transaction(async (manager) => {
            const specialistRepo = manager.getRepository(Specialist);
            const mediaRepo = manager.getRepository(Media);

            // Find specialist
            const specialist = await specialistRepo.findOne({ where: { id: specialistId } });
            if (!specialist) {
                throw new ApiError(404, "Specialist not found");
            }

            // If title changed -> rebuild slug (unique)
            if (data.title && data.title !== specialist.title) {
                specialist.title = data.title;
                specialist.slug = await buildUniqueSlug(specialistRepo, data.title);
            }

            //  Update only allowed fields
            specialist.description = data.description;
            specialist.duration_days = data.estimatedDays;

            // pricing rules (same as create)
            const basePrice = data.price;
            specialist.base_price = basePrice;
            specialist.platform_fee = "0";
            specialist.final_price = basePrice;

            // status rules
            specialist.verification_status = statusMap[data.status];
            specialist.is_verified = data.status === "approved";

            // Todo: additionalOfferings in future
            // specialist.additional_offerings = data.additionalOfferings;

            //  Save specialist update
            await specialistRepo.save(specialist);

            //  If no images -> done
            if (changedSlots.length === 0) {
                return { id: specialist.id };
            }

            //  Load existing media (only for this specialist)
            const existingMedia = await mediaRepo.find({
                where: { specialists: specialistId },
                select: ["id", "file_id", "display_order"],
            });

            const existingByOrder = new Map<number, { id: string; file_id: string | null; display_order: number }>();
            for (const m of existingMedia) existingByOrder.set(m.display_order, m);

            //  Upload new images FIRST (so we don't delete old until uploads succeed)
            // Track newly uploaded cloudinary ids for cleanup if something fails later
            const uploadedNew: {
                order: number;
                secure_url: string;
                public_id: string;
                size: number;
                mimetype: string;
            }[] = [];

            for (const slot of changedSlots) {
                const compressedPath = await compressImage(slot.file.path);
                const cloudRes = await uploadOnCloudinary(compressedPath);

                if (!cloudRes?.secure_url || !cloudRes.public_id) {
                    // cleanup any already uploaded in this request
                    await Promise.allSettled(uploadedNew.map((image) => removeImageFromCloud(image.public_id)));
                    throw new ApiError(400, `Error uploading image ${slot.file.originalname}`);
                }

                uploadedNew.push({
                    order: slot.order,
                    secure_url: cloudRes.secure_url,
                    public_id: cloudRes.public_id,
                    size: slot.file.size,
                    mimetype: slot.file.mimetype,
                });
            }

            // 8) Delete OLD images from cloudinary only for changed slots
            // If any delete fails -> abort and also remove newly uploaded images (compensation)
            const toDeleteFileIds: string[] = [];
            for (const u of uploadedNew) {
                const old = existingByOrder.get(u.order);
                if (old?.file_id) toDeleteFileIds.push(old.file_id);
            }

            if (toDeleteFileIds.length > 0) {
                const deleteResults = await Promise.allSettled(toDeleteFileIds.map((fid) => removeImageFromCloud(fid)));
                const failedDeletes = deleteResults.filter((r) => r.status === "rejected");

                if (failedDeletes.length > 0) {
                    // cleanup newly uploaded (to avoid orphan files)
                    await Promise.allSettled(uploadedNew.map((u) => removeImageFromCloud(u.public_id)));
                    throw new ApiError(500, "Failed to delete one or more old media files. Update aborted.");
                }
            }

            //  Update/Create media DB rows for changed slots
            for (const u of uploadedNew) {
                const existing = existingByOrder.get(u.order);

                if (existing) {
                    // update existing row for that slot
                    await mediaRepo.update(
                        { id: existing.id },
                        {
                            file_name: u.secure_url,
                            file_id: u.public_id,
                            file_size: u.size,
                            mime_type: u.mimetype as MimeType,
                            media_type: MediaType.IMAGE,
                            uploaded_at: new Date(),
                            display_order: u.order,
                        }
                    );
                } else {
                    const row = mediaRepo.create({
                        specialists: specialistId,
                        file_name: u.secure_url,
                        file_id: u.public_id,
                        file_size: u.size,
                        display_order: u.order,
                        mime_type: u.mimetype as MimeType,
                        media_type: MediaType.IMAGE,
                        uploaded_at: new Date(),
                    });
                    await mediaRepo.save(row);
                }
            }

            return { id: specialist.id };
        });
    }

    static async deleteSpecialist(serviceId: string): Promise<void> {
        const db = await connectDB();

        await db.transaction(async (trx) => {
            const specialistRepo = trx.getRepository(Specialist);
            const mediaRepo = trx.getRepository(Media);

            const specialist = await specialistRepo.findOne({ where: { id: serviceId } });
            if (!specialist) {
                throw new ApiError(404, "Specialist not found");
            }

            const mediaList = await mediaRepo.find({
                where: { specialists: serviceId },
                select: ["id", "file_id"],
            });

            if (mediaList.length > 0) {
                const deleteResults = await Promise.allSettled(
                    mediaList.map((media) => (media.file_id ? removeImageFromCloud(media.file_id) : Promise.resolve()))
                );

                const failedDeletes = deleteResults.filter((r) => r.status === "rejected");
                if (failedDeletes.length > 0) {
                    throw new ApiError(500, "Failed to delete one or more media files. Deletion aborted.");
                }
            }

            // 4️⃣ Delete media records
            await mediaRepo.delete({ specialists: serviceId });

            // 5️⃣ Delete specialist
            await specialistRepo.delete({ id: serviceId });
        });
    }
}
