import { NotificationsService } from "@/services/notifications.service";
import { CreateNotificationDto } from "@/types/notification.types";
import { AuthMiddleware } from "@/utils/auth.middleware";
import { Context, Hono } from "hono";
import { StatusCode } from "hono/utils/http-status";

export class NotificationsController {
    private notificationsService: NotificationsService;
    private authMiddleware: AuthMiddleware;

    constructor(notificationsService: NotificationsService, authMiddleware: AuthMiddleware) {
        this.notificationsService = notificationsService;
        this.authMiddleware = authMiddleware;
    }

    registerRoutes(app: Hono) {
        //create a notification
        app.post("/create-notification", async (c, next) => await this.authMiddleware.authenticate(c, next), async (c: Context) => {
            try {
                const notificationBody: CreateNotificationDto = await c.req.json();
                //add user_id to the notification body
                notificationBody.user_id = c.get("user_id");

                const result = await this.notificationsService.createNotification(notificationBody);
                if (result.status === false) {
                    return c.json({
                        statusCode: result.statusCode,
                        status: result.status,
                        message: result.message,
                        data: null,
                        error: result.error,
                    }, result.statusCode as StatusCode);
                }
                return c.json({
                    statusCode: 200,
                    status: true,
                    message: "Notification created successfully.",
                    data: result,
                }, result.statusCode as StatusCode);
            } catch (error) {
                console.error("Error creating notification:", error);
                return c.json({
                    statusCode: 500,
                    status: false,
                    message: "Failed to create notification.",
                    data: null,
                    error: "Internal server error while creating notification.",
                }, 500 as StatusCode);
            }
        });


        //get all notifications for a user
        app.get("/get-notifications/:role", async (c, next) => await this.authMiddleware.authenticate(c, next), async (c: Context) => {
            try {
                const role = c.req.param("role");
                const notifications = await this.notificationsService.getNotifications(c.get("user_id"), role);
                return c.json({
                    statusCode: notifications.statusCode,
                    status: notifications.status,
                    data: notifications.data,
                }, notifications.statusCode as StatusCode);
            } catch (error) {
                console.error("Error fetching notifications:", error);
                return c.json({
                    statusCode: 500,
                    status: false,
                    message: "Failed to fetch notifications.",
                    data: null,
                    error: "Internal server error while fetching notifications.",
                }, 500 as StatusCode);
            }
        });

        //mark a notification as read
        app.post("/mark-notification-as-read/:notification_id", async (c, next) => await this.authMiddleware.authenticate(c, next), async (c: Context) => {
            try {
                const notification_id = parseInt(c.req.param("notification_id"));
                const notification = await this.notificationsService.markNotificationAsRead(notification_id);
                return c.json({
                    statusCode: notification.statusCode,
                    status: notification.status,
                    data: notification.data,
                }, notification.statusCode as StatusCode);
            } catch (error) {
                console.error("Error marking notification as read:", error);
                return c.json({
                    statusCode: 500,
                    status: false,
                    message: "Failed to mark notification as read.",
                    data: null,
                    error: "Internal server error while marking notification as read.",
                }, 500 as StatusCode);
            }
        });

        //mark all notifications as read
        app.post("/mark-all-notifications-as-read", async (c, next) => await this.authMiddleware.authenticate(c, next), async (c: Context) => {
            try {
                const notifications = await this.notificationsService.markAllNotificationsAsRead(c.get("user_id"));
                return c.json({
                    statusCode: notifications.statusCode,
                    status: notifications.status,
                    data: notifications.data,
                }, notifications.statusCode as StatusCode);
            } catch (error) {
                console.error("Error marking all notifications as read:", error);
                return c.json({
                    statusCode: 500,
                    status: false,
                    message: "Failed to mark all notifications as read.",
                    data: null,
                    error: "Internal server error while marking all notifications as read.",
                }, 500 as StatusCode);
            }
        });

    }
}
