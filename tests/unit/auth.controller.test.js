import { it, describe, expect } from "vitest";
import { comparePassword, hashPassword } from "../../src/controllers/auth.controller";


describe("BCrypt test", () => {
    it("should yield a hash if supplied with paintext", async () => {
        const hash = await hashPassword("");

        expect(hash).toBeTruthy();
    });

    it("should verify successfully", async () => {
        const result = await comparePassword("SomeText1", "$2b$10$3kZODsR19DQM7UZRrZgw8OUHQmSfwd8DDWvLbMoSiiWyl4hUc41Ja");

        expect(result).toBe(true);
    });
});


