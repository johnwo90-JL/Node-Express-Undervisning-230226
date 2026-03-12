import z from "zod";
import { Location } from "../models/location.model.js";
import { LoggerFunctionsSchema } from "./logger.service.js";
import { BaseService } from "./base.service.js";

export class LocationsService extends BaseService {
    #logger;

    constructor({ logger }) {
        super();

        this.#logger = logger;
    }

    async findLocationById(id) {
        const location = await Location.findByPk(id);

        if (location === null) {
            this.#logger.warn(`[${this.getServiceMethodSignature()}] Location with ID (${id}) doesn't exist.`)
        }

        return location;
    }

    /**
     * 
     * @param {Location} location 
     * @param {{ lng: number, lng: number}} gpsCoords 
     * @returns 
     */
    calculateDistanceToLocation(location, gpsCoords = { lat: 0, lng: 0 }) {
        return location.distanceTo(gpsCoords);
    }
}
