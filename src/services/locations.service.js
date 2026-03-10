import z from "zod";
import { Location } from "../models/location.model.js";
import { LoggerFunctionsSchema } from "./logger.service.js";

export class LocationsService {
    #logger;

    constructor({ logger }) {
        this.#logger = LoggerFunctionsSchema.parse(logger);
    }

    async findLocationById(id) {
        console.log("Called!");
        const location = await Location.findByPk(id);

        return location;
    }
}

