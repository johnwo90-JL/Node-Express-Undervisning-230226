import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";

import app from "../app.js";
import { users } from "../store/users.js";


describe("DELETE /user/:id", () => {
    beforeEach(() => {
        users.push(
            { id: 1, email: 'test1@test.com', username: 'test1', password: "pw1"},
            { id: 2, email: 'test2@test.com', username: 'test2', password: "pw2"}
        )
    })

    it("returns 400 if id is not a posetive integer", async () => {
        const res = await request(app).delete("/users/abc");

        expect(res.status).toBe(400)
        expect(res.body).toEqual({
            message: "Invalid ID"
        })
    })

    it("returns 400 if id is less than 1", async () => {
        const res = await request(app).delete("/users/0");

        expect(res.status).toBe(400)
        expect(res.body).toEqual({
            message: "Invalid ID"
        })
    })

    it("deletes the user test1 and returns 200", async () => {
        const res = await request(app).delete('/users/1');

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            message: "User deleted successfully",
            data: { id: 1, email: 'test1@test.com', username: 'test1', password: "pw1"}
        });
    })
})