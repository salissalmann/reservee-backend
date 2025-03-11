import { OrganizationService } from "@/services/organizations.service";
import { AuthMiddleware } from "@/utils/auth.middleware";
import { Context, Hono } from "hono";

export class OrganizationController {
    private organizationService: OrganizationService;
    private authMiddleware: AuthMiddleware;

    constructor(organizationService: OrganizationService, authMiddleware: AuthMiddleware) {
        this.organizationService = organizationService;
        this.authMiddleware = authMiddleware;
    }

    registerRoutes(app: Hono) {
        app.post(
            "/create-organization",
            async (c, next) => await this.authMiddleware.authenticate(c, next),
            async (c: Context) => {
                try {
                    const { name, description, logo, categories } = await c.req.json();
                    const userId = c.get("user_id");
                    if (!name || !description || !logo || !categories) {
                        return c.json(
                            {
                                statusCode: 400,
                                status: false,
                                message: "Missing required fields: name, description, logo, categories",
                                data: null,
                                error: "Missing required fields: name, description, logo, categories"
                            },
                            400
                        );
                    }

                    const orgExits = await this.organizationService.getOrganizationsByName(name);

                    if (orgExits) {
                        return c.json(
                            {
                                statusCode: 409,
                                status: false,
                                message: "Organization name already exists",
                                data: null,
                                error: "Organization name already exists"
                            },
                            409
                        );
                    }

                    const organization = await this.organizationService.createOrganization(
                        name,
                        description,
                        logo,
                        userId
                    );

                    return c.json({
                        statusCode: 201,
                        status: true,
                        message: "Organization created successfully",
                        data: organization
                    }, 201);
                } catch (error) {
                    console.error("Error creating organization:", error);
                    return c.json({
                        statusCode: 500,
                        status: false,
                        message: "Failed to create organization",
                        data: null,
                        error: "Internal server error"
                    }, 500);
                }
            }
        );

        app.get(
            "/get-vendor-organization",
            async (c, next) => await this.authMiddleware.authenticate(c, next),
            async (c: Context) => {
                try {
                    const userId = c.get("user_id");
                    console.log('userId----', userId)
                    const organizations = await this.organizationService.getOrganizationsByUserIdOnly(userId);

                    return c.json({
                        statusCode: 200,
                        status: true,
                        message: "Organizations fetched successfully",
                        data: organizations
                    }, 200);
                } catch (error) {
                    console.error("Error fetching organizations:", error);
                    return c.json({
                        statusCode: 500,
                        status: false,
                        message: "Failed to fetch organizations",
                        data: null,
                        error: "Internal server error"
                    }, 500);
                }
            }
        );

        app.get(
            "/get-all-vendor-organizations",
            async (c, next) => await this.authMiddleware.authenticate(c, next),
            async (c: Context) => {
                try {
                    const userId = c.get("user_id");
                    const organizations = await this.organizationService.getAllOrganizationsByUser(userId);

                    return c.json({
                        statusCode: 200,
                        status: true,
                        message: "Organizations fetched successfully",
                        data: organizations
                    }, 200);
                } catch (error) {
                    console.error("Error fetching organizations:", error);
                    return c.json({
                        statusCode: 500,
                        status: false,
                        message: "Failed to fetch organizations",
                        data: null,
                        error: "Internal server error"
                    }, 500);
                }
            }
        );

        app.put(
            "/update-organization/:orgId",
            async (c, next) => await this.authMiddleware.authenticate(c, next),
            async (c: Context) => {
                try {
                    const orgId = parseInt(c.req.param("orgId"));
                    const userId = c.get("user_id");
                    const { name, description, logo, categories } = await c.req.json();

                    if (!name || !description || !logo || !categories) {
                        return c.json(
                            {
                                statusCode: 400,
                                status: false,
                                message: "Missing required fields: name, description, logo, categories",
                                data: null,
                                error: "Missing required fields: name, description, logo, categories"
                            },
                            400
                        );
                    }

                    let logoUrl = logo;

                    // Check if the logo is a URL; if not, upload to R2 and generate a URL
                    // if (!logo.startsWith("https")) {
                    //     // Replace with actual R2 upload logic
                    //     logoUrl = `https://example-r2-url/${Date.now()}-${name}`;
                    // }

                    const updatedOrganization = await this.organizationService.updateOrganization(
                        orgId,
                        name,
                        description,
                        logoUrl,
                        userId
                    );

                    return c.json({
                        statusCode: 200,
                        status: true,
                        message: "Organization updated successfully",
                        data: updatedOrganization
                    }, 200);
                } catch (error) {
                    console.error("Error updating organization:", error);
                    return c.json({
                        statusCode: 500,
                        status: false,
                        message: "Failed to update organization",
                        data: null,
                        error: "Internal server error"
                    }, 500);
                }
            }
        );

        app.get(
            "/get-organization-by-id/:orgId",
            async (c, next) => await this.authMiddleware.authenticate(c, next),
            async (c: Context) => {
                const orgId = parseInt(c.req.param("orgId"));

                const organization = await this.organizationService.getOrganizationById(orgId);

                return c.json({
                    statusCode: 200,
                    status: true,
                    message: "Organization fetched successfully",
                    data: organization
                }, 200);
            }
        )

    }
}
