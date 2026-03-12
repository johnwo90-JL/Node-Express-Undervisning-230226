import { randomUUID } from "node:crypto";
import { describe, it, should, expect, beforeAll, vi } from "vitest";
import { LocationsService } from "../../src/services/locations.service.js";

/** @type LocationsService */
let service = null;
let loggerMock = Object.fromEntries(
    ["log", "info", "warn", "error"].map(e => [e, vi.fn()])
);

describe("LocationService, unit", () => {
    beforeAll(() => {
        service = new LocationsService({ logger: loggerMock});
    }); 


    it("should not find non-existent location", async () => {
        const uuid = randomUUID()
        // const res = serverApp.get("/locations/")
        await service.findLocationById(uuid);
        expect(loggerMock["warn"]).toHaveBeenCalledExactlyOnceWith(`[LocationsService->findLocationById] Location with ID (${uuid}) doesn't exist.`);
    });


    // it("should ", () => {});
})
