import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/apiResponse";
import { SpecialistServices } from "../services/specialist.services";
import { ApiError } from "../utils/apiError";

export const createSpecialist = asyncHandler(async (req: Request, res: Response) => {
    const body = req.body;
    const files = ((req as any).validatedFiles ?? req.files ?? []) as Express.Multer.File[];
    const id = await SpecialistServices.createSpecialist(body, files);
    res.status(201).json(
        new ApiResponse(201, { id }, "Service created successfully! Specialist & Media Tables Updated.")
    );
});

export const publishSpecialist = asyncHandler(async (req: Request, res: Response) => {
    const { serviceId } = req.body;

    if (!serviceId) {
        throw new ApiError(400, "serviceId is required");
    }
    const id = await SpecialistServices.publishSpecialist(serviceId);

    res.status(200).json(new ApiResponse(200, { id }, "Service published successfully!"));
});
