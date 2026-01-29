import fs from "fs";
import path from "path";

export const cleanupTempDirectory = (dirPath: string): void => {
    setTimeout(() => {
        try {
            if (fs.existsSync(dirPath)) {
                const files = fs.readdirSync(dirPath);
                files.forEach((file) => {
                    if (file !== ".gitkeep") {
                        const filePath = path.join(dirPath, file);
                        fs.unlink(filePath, (err) => {
                            if (err) {
                                if (process.env.NODE_ENV === "development") {
                                    console.error(`Error deleting file ${file}:`, err);
                                }

                                // Retry after a short delay
                                setTimeout(() => {
                                    fs.unlink(filePath, (retryErr) => {
                                        if (retryErr) {
                                            console.error(`Retry failed for file ${file}:`, retryErr);
                                        }
                                    });
                                }, 1000);
                            } else {
                                if (process.env.NODE_ENV === "development") {
                                    console.log(`File ${file} deleted successfully.`);
                                }
                            }
                        });
                    }
                });
            }
        } catch (error) {
            if (process.env.NODE_ENV === "development") {
                console.error("Error cleaning up temp directory:", error);
            }
        }
    }, 1000); // Delay for safety
};
