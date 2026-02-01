import { connectDB } from "../db/db";
import { MediaType, MimeType, VerificationStatus } from "../entities/enums/specialist.enum";
import { Media } from "../entities/Media.entity";
import { Specialist } from "../entities/Specialist.entity";
import { ApiError } from "../utils/apiError";
import { cleanupTempDirectory } from "../utils/cleanUpTemp";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { compressImage } from "../utils/imageCompressor";
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
    static async createSpecialist(data: CreateSpecialistBody, files: Express.Multer.File[]): Promise<string> {
        if (!files || files.length !== 3) {
            throw new ApiError(400, "Exactly 3 images are required");
        }

        const db = await connectDB();

        return await db.transaction(async (manager) => {
            const specialistRepo = manager.getRepository(Specialist);
            const mediaRepo = manager.getRepository(Media);

            const statusMap: Record<CreateSpecialistBody["status"], VerificationStatus> = {
                pending: VerificationStatus.PENDING,
                "under-review": VerificationStatus.PENDING,
                approved: VerificationStatus.APPROVED,
                rejected: VerificationStatus.REJECTED,
            };

            const basePrice = data.price;

            const platformFee = "0.00";
            const finalPrice = basePrice;

            // ✅ slug is required and unique
            const slug = await buildUniqueSlug(specialistRepo, data.title);

            // ✅ Create Specialist with correct entity fields
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

            // ✅ saved is a single Specialist
            const saved = await specialistRepo.save(specialist);

            // ✅ Create Media rows (FK-only to avoid relation typing issues)
            const mediaRows: Media[] = [];

            for (let i = 0; i < files.length; i++) {
                const f = files[i];

                const compressed = await compressImage(f.path);
                const uploaded = await uploadOnCloudinary(compressed);

                if (!uploaded) {
                    throw new ApiError(400, `Error uploading image ${i + 1}`);
                }

                const media = mediaRepo.create({
                    specialists: saved.id,
                    file_name: uploaded.secure_url,
                    file_size: f.size,
                    display_order: i,
                    mime_type: f.mimetype as MimeType,
                    media_type: MediaType.IMAGE,
                    uploaded_at: new Date(),
                });

                mediaRows.push(media);
            }

            await mediaRepo.save(mediaRows);

            return saved.id;
        });
    }
}
