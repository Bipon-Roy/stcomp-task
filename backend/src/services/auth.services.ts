import { CookieOptions, Response } from "express";
import { connectDB } from "../db/db";
import { User } from "../entities/User.entity";
import { ISignInRequest } from "../types";
import { ApiError } from "../utils/apiError";
import { generateAccessAndRefreshTokens } from "../utils/generateToken";
import bcrypt from "bcrypt";
import { clearSession, TokenPayload } from "../middlewares/auth.middleware";
import jwt from "jsonwebtoken";

interface LoginResult {
    user: any;
    accessToken: string;
    refreshToken: string;
}

export class AuthService {
    static async loginUser(body: ISignInRequest): Promise<LoginResult> {
        const { email, password } = body;

        const db = await connectDB();
        const userRepo = db.getRepository(User);

        const user = await userRepo.findOne({ where: { email } });

        if (!user) throw new ApiError(404, "User does not exist");

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) throw new ApiError(401, "Invalid user email or password");

        const { accessToken, refreshToken } = generateAccessAndRefreshTokens({
            id: user.id,
            name: user.name,
        });

        user.accessToken = accessToken;
        user.refreshToken = refreshToken;
        await userRepo.save(user);

        return {
            user: { id: user.id, name: user.name, email: user.email },
            accessToken,
            refreshToken,
        };
    }

    //logout
    static async logoutUser(userId: string): Promise<void> {
        const db = await connectDB();
        const userRepo = db.getRepository(User);

        const user = await userRepo.findOne({ where: { id: userId } });
        if (!user) throw new ApiError(404, "User not found");

        user.refreshToken = null;
        user.accessToken = null;

        await userRepo.save(user);
    }

    //session-renew
    static async refreshSession(refreshToken: string | undefined, res: Response): Promise<void> {
        if (!refreshToken) {
            clearSession(res);
            throw new ApiError(403, "No refresh token provided");
        }

        if (!process.env.REFRESH_TOKEN_SECRET) {
            clearSession(res);
            throw new ApiError(500, "Missing REFRESH_TOKEN_SECRET");
        }

        const db = await connectDB();
        const userRepo = db.getRepository(User);

        try {
            // verify refresh token
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET) as TokenPayload;

            // Find user by id (from token) and confirm the refreshToken matches DB (prevents stolen/old tokens)
            const user = await userRepo.findOne({
                where: { id: decoded.id },
            });

            if (!user || !user.refreshToken) {
                clearSession(res);
                throw new ApiError(401, "Invalid or expired refresh token");
            }

            // token mismatch = invalid session
            if (user.refreshToken !== refreshToken) {
                clearSession(res);
                throw new ApiError(401, "Invalid or expired refresh token");
            }

            // rotate tokens
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = generateAccessAndRefreshTokens({
                id: user.id,
                name: user.name,
            });

            // save new tokens
            user.accessToken = newAccessToken;
            user.refreshToken = newRefreshToken;
            await userRepo.save(user);

            // set cookies
            this.setAuthCookies(res, newAccessToken, newRefreshToken);
            return;
        } catch (err: any) {
            // if token expired, invalidate session in DB
            if (err?.name === "TokenExpiredError") {
                await AuthService.invalidateUserSession(refreshToken);
                clearSession(res);
                throw new ApiError(401, "Session expired! Please log in again.");
            }

            clearSession(res);
            throw new ApiError(401, "Session expired. Please log in again.");
        }
    }

    private static async invalidateUserSession(refreshToken: string): Promise<void> {
        const db = await connectDB();
        const userRepo = db.getRepository(User);

        const user = await userRepo.findOne({
            where: { refreshToken },
            select: ["id", "refreshToken", "accessToken"],
        });

        if (!user) return;

        user.refreshToken = null;
        user.accessToken = null;

        await userRepo.save(user);
    }

    private static setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
        const isProd = process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
        const cookieOptions: CookieOptions = {
            httpOnly: true,
            secure: isProd,
            maxAge: 2 * 24 * 60 * 60 * 1000,
            path: "/",
        };

        res.cookie("accessToken", accessToken, cookieOptions);
        res.cookie("refreshToken", refreshToken, cookieOptions);
    }
}
