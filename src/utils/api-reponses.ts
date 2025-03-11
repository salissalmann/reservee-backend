export class ApiResponse {
    static success(data: any = null, message: string = "Request successful", statusCode: number = 200) {
        return {
            statusCode,
            status: true,
            message,
            data,
        };
    }

    static error(message: string = "An error occurred", error: any = null, statusCode: number = 500) {
        return {
            statusCode,
            status: false,
            message,
            data: null,
            error,
        };
    }

    static validationError(message: string = "Validation failed", errors: any = null, statusCode: number = 400) {
        return {
            statusCode,
            status: false,
            message,
            data: null,
            error: errors,
        };
    }

    static conflictError(message: string = "Validation failed", errors: any = null, statusCode: number = 409) {
        return {
            statusCode,
            status: false,
            message,
            data: null,
            error: errors,
        };
    }
}
