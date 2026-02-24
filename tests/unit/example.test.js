import { it, describe, expect } from "vitest";
import request from "supertest";
import app from "../../src/app";


describe("POST /users", () => {
     it("returns 201 if user was created sucessfully", async () => {
        const res = await request(app)
            .post("/users")
            .send({
                "username": "Foo2n",
                "email": "thor@bar.com",
                "password": "foobar12"
            })
            .accept("application/json"); // MIME-type

        expect(res.status).toBe(201); // Created

        console.log("Actual status:", res.status);
    });

    it("returns 409 if user already exists", async () => {
        const res = await request(app)
            .post("/users")
            .send({
                "username": "Foo2n",
                "email": "thor@bar.com",
                "password": "foobar12"
            })
            .accept("application/json"); // MIME-type

        expect(res.status).toEqual(409); // Created

        console.log("Actual status:", res.status);
    });
});
