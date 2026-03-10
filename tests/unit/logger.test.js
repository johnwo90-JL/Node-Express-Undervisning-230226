import { describe, expect, it, vi } from "vitest";
import { LoggerService } from "../../src/services/logger.service";
import { setupTests } from "../setup";

setupTests(); 

describe("Logger sanity-check", () => {

    it("should log to console, all variants", async () => {
        console.log("Test started");

        const functions = {
            log: vi.fn(),
            info: vi.fn(),
            warn: vi.fn(),
            error: vi.fn(),
        }

        const message = "Hello, World!";
        const logger = new LoggerService(functions);
        
        for (const func in functions) {
            logger[func](message);
            expect(functions[func]).toHaveBeenCalled();
            expect(functions[func]).toHaveBeenCalledWith(message);
        }
        console.log("Test finished");
    });
});