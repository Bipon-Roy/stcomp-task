import sharp from "sharp";
import path from "path";
import { randomUUID } from "crypto";

export const compressImage = async (filePath: string): Promise<string> => {
    const compressedFilePath = path.join(
        path.dirname(filePath),
        `compressed-${randomUUID()}.webp` // Compressed image saved as WebP
    );

    try {
        await sharp(filePath)
            .webp({ quality: 70 }) // Convert to WebP with 80% quality
            .toFile(compressedFilePath);

        sharp.cache(false);

        return compressedFilePath;
    } catch (error) {
        console.error("Error compressing image:", error);
        throw new Error("Image compression failed");
    }
};
