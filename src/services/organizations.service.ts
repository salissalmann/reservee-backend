import { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { organizationsTable } from "@/schemas/organizations.schema";
import { eq, and } from "drizzle-orm";

export class OrganizationService {
    private db: NeonHttpDatabase;

    constructor(db: NeonHttpDatabase) {
        this.db = db;
    }

    async createOrganization(name: string, description: string, logoUrl: string, createdBy: number) {
        const [organization] = await this.db
            .insert(organizationsTable)
            .values({
                name,
                description,
                logo: logoUrl,
                created_by: createdBy,
                updated_by: createdBy,
            })
            .returning();

        return organization;
    }

    async getOrganizationsByUserId(orgId: number, userId: number) {
        const organizations = await this.db
            .select()
            .from(organizationsTable)
            .where(and(
                eq(organizationsTable.created_by, userId),
                eq(organizationsTable.id, orgId)
            ));

        return organizations[0];
    }

    async getOrganizationsByUserIdOnly(userId: number) {
        const organizations = await this.db
            .select()
            .from(organizationsTable)
            .where(
                eq(organizationsTable.created_by, userId),

            );

        return organizations[0];
    }

    
    async getAllOrganizationsByUser(userId: number) {
        const organizations = await this.db
            .select()
            .from(organizationsTable)
            .where(
                eq(organizationsTable.created_by, userId),

            );
        return organizations;
    }

    async getOrganizationsByName(name: string) {


        const organizations = await this.db
            .select()
            .from(organizationsTable)
            .where(eq(organizationsTable.name, name));

        return organizations[0];
    }

    async getOrganizationsById(id: number) {


        const organizations = await this.db
            .select()
            .from(organizationsTable)
            .where(eq(organizationsTable.id, id));

        return organizations[0];
    }

    async updateOrganization(orgId: number, name: string, description: string, logoUrl: string, updatedBy: number) {
        const updatedOrganization = await this.db
            .update(organizationsTable)
            .set({
                name,
                description,
                logo: logoUrl,
                updated_by: updatedBy

            })
            .where(eq(organizationsTable.id, orgId))
            .returning();

        return updatedOrganization[0];
    }

    async getOrganizationById(orgId: number) {
        const organization = await this.db
            .select()
            .from(organizationsTable)
            .where(eq(organizationsTable.id, orgId));
        return organization[0];
    }
}
