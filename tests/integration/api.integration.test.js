import { afterEach, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import { SessionToken } from "../../src/models/session-token.model.js";
import { User } from "../../src/models/user.model.js";

async function clearDatabase() {
    await SessionToken.destroy({ where: {} });
    await User.destroy({ where: {} });
}

afterEach(async () => {
    await clearDatabase();
});

describe("Auth and user architecture", () => {
    it("registers with Sequelize and rejects duplicate email", async () => {
        const firstResponse = await request(app)
            .post("/auth/register")
            .send({
                name: "Alice",
                email: "alice@example.com",
                password: "password123",
            });

        expect(firstResponse.status).toBe(201);
        expect(firstResponse.body.success).toBe(true);
        expect(firstResponse.body.data.email).toBe("alice@example.com");
        expect(firstResponse.body.data.password).toBeUndefined();

        const secondResponse = await request(app)
            .post("/auth/register")
            .send({
                name: "Alice2",
                email: "alice@example.com",
                password: "password123",
            });

        expect(secondResponse.status).toBe(409);
    });

    it("authenticates with JWT cookies and exposes /auth/me", async () => {
        await request(app).post("/auth/register").send({
            name: "Bob",
            email: "bob@example.com",
            password: "password123",
        });

        const agent = request.agent(app);

        const loginResponse = await agent
            .post("/auth/login/jwt")
            .send({
                identifier: "bob@example.com",
                password: "password123",
            });

        expect(loginResponse.status).toBe(200);
        expect(loginResponse.body.data.strategy).toBe("jwt");
        expect(loginResponse.headers["set-cookie"].some((cookie) => cookie.includes("accessToken="))).toBe(true);
        expect(loginResponse.headers["set-cookie"].some((cookie) => cookie.includes("refreshToken="))).toBe(true);

        const meResponse = await agent.get("/auth/me");
        expect(meResponse.status).toBe(200);
        expect(meResponse.body.data.strategy).toBe("jwt");
        expect(meResponse.body.data.user.email).toBe("bob@example.com");
    });

    it("authenticates BASIC on each request", async () => {
        await User.create({
            name: "BasicUser",
            email: "basic@example.com",
            password: "password123",
            roles: ["user"],
        });

        const basicHeader = `Basic ${Buffer.from("basic@example.com:password123").toString("base64")}`;

        const response = await request(app)
            .get("/auth/basic/me")
            .set("Authorization", basicHeader);

        expect(response.status).toBe(200);
        expect(response.body.data.strategy).toBe("basic");
        expect(response.body.data.user.email).toBe("basic@example.com");
    });

    it("enforces RBAC for admin routes", async () => {
        await User.create({
            name: "NormalUser",
            email: "normal@example.com",
            password: "password123",
            roles: ["user"],
        });

        const agent = request.agent(app);
        await agent.post("/auth/login/jwt").send({
            identifier: "normal@example.com",
            password: "password123",
        });

        const response = await agent.get("/users");
        expect(response.status).toBe(403);
    });

    it("allows superadmin to update roles", async () => {
        const superAdmin = await User.create({
            name: "SuperAdmin",
            email: "superadmin@example.com",
            password: "password123",
            roles: ["superadmin"],
        });

        const targetUser = await User.create({
            name: "TargetUser",
            email: "target@example.com",
            password: "password123",
            roles: ["user"],
        });

        const superAdminAgent = request.agent(app);
        await superAdminAgent.post("/auth/login/jwt").send({
            identifier: "superadmin@example.com",
            password: "password123",
        });

        const updateRolesResponse = await superAdminAgent
            .patch(`/users/${targetUser.id}/roles`)
            .send({
                roles: ["admin"],
            });

        expect(updateRolesResponse.status).toBe(200);
        expect(updateRolesResponse.body.data.roles).toEqual(["admin"]);

        const targetUserInDb = await User.findByPk(targetUser.id);
        expect(targetUserInDb.roles).toEqual(["admin"]);
        expect(superAdmin.id).toBeTruthy();
    });
});
