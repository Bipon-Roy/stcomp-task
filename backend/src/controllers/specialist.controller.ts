import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/apiResponse";
import { SpecialistServices } from "../services/specialist.services";
import { ApiError } from "../utils/apiError";

export const getAllSpecialist = asyncHandler(async (req: Request, res: Response) => {
    const page = Number.parseInt(String(req.query.page ?? ""), 10) || 1;
    const limit = Number.parseInt(String(req.query.limit ?? ""), 10) || 10;
    const search = (req.query.search as string) || "";
    const verificationStatus = (req.query.status as string) || "";
    const result = await SpecialistServices.getAllSpecialist({
        page,
        limit,
        search,
        status: verificationStatus,
        tab: (req.query.tab as any) || "all",
        sortBy: (req.query.sortBy as any) || "created_at",
        order: (req.query.order as any) || "DESC",
    });
    res.status(200).json(new ApiResponse(200, result, "Specialists retrieved successfully"));
});

export const createSpecialist = asyncHandler(async (req: Request, res: Response) => {
    const body = req.body;
    const files = ((req as any).validatedFiles ?? req.files ?? []) as Express.Multer.File[];
    const id = await SpecialistServices.createSpecialist(body, files);
    res.status(201).json(
        new ApiResponse(201, { id }, "Specialist created successfully! Specialist & Media Tables Updated.")
    );
});

export const publishSpecialist = asyncHandler(async (req: Request, res: Response) => {
    const { serviceId } = req.body;

    if (!serviceId) {
        throw new ApiError(400, "serviceId is required");
    }
    const id = await SpecialistServices.publishSpecialist(serviceId);

    res.status(200).json(new ApiResponse(200, { id }, "Specialist published successfully!"));
});

export const deleteSpecialist = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
        throw new ApiError(400, "Specialist ID must be a single value");
    }
    await SpecialistServices.deleteSpecialist(id);

    res.status(200).json(new ApiResponse(200, null, "Specialist deleted successfully"));
});
