import path from "path";
import os from "os";
import fs from "fs";

const isVercel = !!process.env.VERCEL;

export const TEMP_DIR = isVercel
    ? path.join(os.tmpdir(), "uploads")
    : path.resolve(process.env.TEMP_DIR || "./public/temp");

export const ensureTempDir = () => {
    if (!fs.existsSync(TEMP_DIR)) {
        fs.mkdirSync(TEMP_DIR, { recursive: true });
    }
};
