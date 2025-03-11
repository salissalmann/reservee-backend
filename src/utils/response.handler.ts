import { Context } from "hono";
import { StatusCode } from "hono/utils/http-status";

export class ResponseHandler {
    static success<T>(
        c: Context,
        message: string,
        data: T,
        statusCode: StatusCode = 200
    ) {
        return c.json({
            statusCode,
            status: true,
            message,
            data,
        }, statusCode);
    }

    static error(
        c: Context,
        message: string,
        error?: string,
        statusCode: StatusCode = 500,
        data: any = null
    ) {
        return c.json({
            statusCode,
            status: false,
            message,
            data,
            error: error || "Internal server error",
        }, statusCode);
    }

    static validationError(
        c: Context,
        message: string,
        error?: string,
        data: any = null
    ) {
        return this.error(c, message, error, 400, data);
    }

    static unauthorized(
        c: Context,
        message: string = "Unauthorized",
        error?: string
    ) {
        return this.error(c, message, error, 401);
    }

    static forbidden(
        c: Context,
        message: string = "Forbidden",
        error?: string
    ) {
        return this.error(c, message, error, 403);
    }

    static notFound(
        c: Context,
        message: string = "Not found",
        error?: string
    ) {
        return this.error(c, message, error, 404);
    }
} 