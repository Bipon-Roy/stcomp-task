import { CookieOptions, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ISignInRequest } from "../types";
import { AuthService } from "../services/auth.services";
import { ApiResponse } from "../utils/apiResponse";
import { clearSession } from "../middlewares/auth.middleware";

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as ISignInRequest;

    const { user, accessToken, refreshToken } = await AuthService.loginUser(body);
    const isProd = process.env.VERCEL === "1" || process.env.NODE_ENV === "production";

    const options: CookieOptions = {
        httpOnly: false,
        secure: isProd,
        maxAge: 2 * 24 * 60 * 60 * 1000,
        sameSite: "none",
        domain: ".vercel.app",
        path: "/",
    };

    // Set cookies
    const response = res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options);

    return response.json(new ApiResponse(200, { user }, "Signin Successful!"));
});

export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    const data = req.user;

    const user = {
        id: data?.id,
        name: data?.name,
        email: data?.email,
    };
    return res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
});

export const refreshTokenController = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.["refreshToken"];
    await AuthService.refreshSession(refreshToken, res);

    return res.status(200).json(new ApiResponse(200, null, "Session refreshed successfully"));
});

export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        return;
    }
    await AuthService.logoutUser(userId);

    clearSession(res);
    return res.status(200).json(new ApiResponse(200, {}, "Logged out successfully"));
});
