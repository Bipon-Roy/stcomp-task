import jwt from "jsonwebtoken";

export interface IUserTokenPayload {
    id: string;
    name?: string;
}

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

const ACCESS_EXPIRES_IN = "3h";
const REFRESH_EXPIRES_IN = "1d";

export const generateAccessToken = (user: IUserTokenPayload): string => {
    if (!process.env.ACCESS_TOKEN_SECRET) throw new Error("Missing ACCESS_TOKEN_SECRET");

    return jwt.sign({ id: user.id, name: user.name }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_EXPIRES_IN,
    });
};

export const generateRefreshToken = (user: Pick<IUserTokenPayload, "id">): string => {
    if (!process.env.REFRESH_TOKEN_SECRET) throw new Error("Missing REFRESH_TOKEN_SECRET");

    return jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_EXPIRES_IN,
    });
};

export const generateAccessAndRefreshTokens = (user: IUserTokenPayload): TokenPair => {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken({ id: user.id });
    return { accessToken, refreshToken };
};
