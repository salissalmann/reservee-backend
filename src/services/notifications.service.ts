import { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { and, eq, or, gte, lte, like, sql, inArray } from "drizzle-orm";
import { notificationsTable } from "@/schemas/notifications";
import { CreateNotificationDto } from "@/types/notification.types";

export class NotificationsService {
    private db: NeonHttpDatabase;

    constructor(db: NeonHttpDatabase) {
        this.db = db;
    }
    
    //create a notification
    async createNotification(notificationBody: CreateNotificationDto) {

        if (!notificationBody.icon_type) {
            return {
                status: false,
                statusCode: 400,
                message: "Icon type is required.",
                error: "Icon type is required.",
            };
        }

        if (!notificationBody.type) {
            notificationBody.type = "USER";
        }

        if (notificationBody.color_scheme && !notificationBody.color_scheme.startsWith("#")) {
            return {
                status: false,
                statusCode: 400,
                message: "Color scheme must be in hex format.",
                error: "Color scheme must be in hex format.",
            };
        }

        if (notificationBody.buttons && notificationBody.buttons.length > 0) {
            for (const button of notificationBody.buttons) {
                if (button.color && !button.color.startsWith("#")) {
                    return {
                        status: false,
                        statusCode: 400,
                        message: "Button color must be in hex format.",
                        error: "Button color must be in hex format.",
                    };
                }
            }
        }

        const notification = await this.db.insert(notificationsTable).values(notificationBody).returning();
        return {
            status: true,
            statusCode: 201,
            message: "Notification created successfully.",
            data: notification,
        };
    }

    //get all notifications for a user
    async getNotifications(user_id: number, role: string) {
        if (role.toUpperCase() !== "USER" && role.toUpperCase() !== "VENDOR" && role.toUpperCase() !== "ALL" && role.toUpperCase() !== "ADMIN") {
            return {
                status: false,
                statusCode: 400,
                message: "Invalid role.",
                error: "Invalid role.",
            };
        }
        const notifications = await this.db.select().from(notificationsTable).where(and(eq(notificationsTable.user_id, user_id), eq(notificationsTable.type, role.toUpperCase())));
        return {
            status: true,
            statusCode: 200,
            message: "Notifications fetched successfully.",
            data: notifications,
        };
    }

    //mark a notification as read
    async markNotificationAsRead(notification_id: number) {
        if (!notification_id) {
            return {
                status: false,
                statusCode: 400,
                message: "Notification ID is required.",
                error: "Notification ID is required.",
            };
        }
        const notification = await this.db.update(notificationsTable).set({ is_read: true }).where(eq(notificationsTable.id, notification_id));
        if (!notification) {
            return {
                status: false,
                statusCode: 404,
                message: "Notification not found.",
                error: "Notification not found.",
            };
        }
        return {
            status: true,
            statusCode: 200,
            message: "Notification marked as read successfully.",
            data: notification,
        };
    }
   
    //mark all notifications as read
    async markAllNotificationsAsRead(user_id: number) {
        const notifications = await this.db.update(notificationsTable).set({ is_read: true }).where(eq(notificationsTable.user_id, user_id));
        return {
            status: true,
            statusCode: 200,
            message: "All notifications marked as read successfully.",
            data: notifications,
        };
    }
}

