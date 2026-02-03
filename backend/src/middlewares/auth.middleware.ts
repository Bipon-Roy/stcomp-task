import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { connectDB } from "../db/db";
import { User } from "../entities/User.entity";

export interface TokenPayload extends JwtPayload {
    id: string;
    name: string;
}
const getAccessToken = (req: Request): string | undefined => {
    const bearerToken = req.header("Authorization")?.replace("Bearer ", "")?.trim();
    return req.cookies?.["accessToken"] || bearerToken;
};

const verifyJwtTokenAndGetUser = async (accessToken: string, res: Response) => {
    try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as TokenPayload;

        const db = await connectDB();
        const userRepo = db.getRepository(User);

        const user = await userRepo.findOne({
            where: { id: decoded.id },
        });
        if (!user) {
            throw new ApiError(401, "User not found");
        }

        if (user.accessToken !== accessToken) {
            user.refreshToken = null;
            user.accessToken = null;

            await userRepo.save(user);

            clearSession(res);
            throw new ApiError(403, "Session Invalid");
        }

        return user;
    } catch (error: any) {
        if (error instanceof ApiError) {
            throw error;
        }
        if (error.name === "TokenExpiredError") {
            throw new ApiError(401, "Access token expired");
        }
        throw new ApiError(401, "Invalid access token");
    }
};

export const verifyToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = getAccessToken(req);
    if (!accessToken) {
        throw new ApiError(401, "Access token missing");
    }
    // JWT path
    const user = await verifyJwtTokenAndGetUser(accessToken, res);
    req.user = user;
    next();
});

export const clearSession = (res: Response) => {
    const isProd = process.env.VERCEL === "1" || process.env.NODE_ENV === "production";

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: isProd,
        maxAge: 2 * 24 * 60 * 60 * 1000,
        path: "/",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: isProd,
        maxAge: 2 * 24 * 60 * 60 * 1000,
        path: "/",
    });
};
