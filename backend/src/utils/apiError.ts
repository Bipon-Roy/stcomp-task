type ValidationErrors = Record<string, string>;

class ApiError extends Error {
    statusCode: number;
    data: any | null;
    success: boolean;
    errors?: ValidationErrors | string[];

    constructor(
        statusCode: number,
        message: string = "Something went wrong",
        errors?: ValidationErrors | string[],
        stack: string = "",
        data: any = null
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };
