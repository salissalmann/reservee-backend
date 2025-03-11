import { z } from "zod";

export const CreateNotificationSchema = z.object({
    user_id: z.number(),
    color_scheme: z.string().optional(),
    icon_type: z.enum(["WARNING", "INFO", "SUCCESS", "ERROR"]),
    title: z.string(),
    description: z.string(),
    buttons: z.array(z.object({
        text: z.string(),
        icon: z.string().optional(),
        color: z.string().optional(),
        url: z.string().optional(),
    })).optional(),
    type: z.enum(["USER", "VENDOR", "ALL", "ADMIN"]).optional(),
});

export type CreateNotificationDto = z.infer<typeof CreateNotificationSchema>;