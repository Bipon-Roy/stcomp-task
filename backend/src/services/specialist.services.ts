import { connectDB } from "../db/db";
import { MediaType, MimeType, VerificationStatus } from "../entities/enums/specialist.enum";
import { Media } from "../entities/Media.entity";
import { Specialist } from "../entities/Specialist.entity";
import { GetAllSpecialistsParams, SpecialistListItem } from "../types";
import { ApiError } from "../utils/apiError";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { compressImage } from "../utils/imageCompressor";
import { applyEnumFilter, applySearch, applySort, buildMeta, normalizePageLimit } from "../utils/queryBuilder";
import { CreateSpecialistBody } from "../validators/specialist.validator";

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
        qb.skip((page - 1) * limit).take(limit);

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
}
