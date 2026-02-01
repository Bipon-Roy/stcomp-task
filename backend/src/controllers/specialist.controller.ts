import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/apiResponse";
import { SpecialistServices } from "../services/specialist.services";

export const createSpecialist = asyncHandler(async (req: Request, res: Response) => {
    const body = req.body;
    const files = ((req as any).validatedFiles ?? req.files ?? []) as Express.Multer.File[];
    const id = await SpecialistServices.createSpecialist(body, files);
    res.status(201).json(
        new ApiResponse(201, { id }, "Service created successfully! Specialist & Media Tables Updated.")
    );
});
