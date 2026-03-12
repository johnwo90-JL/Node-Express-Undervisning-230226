import z from "zod";
import { Location } from "../models/location.model.js";
import { LoggerFunctionsSchema } from "./logger.service.js";
import { BaseService } from "./base.service.js";

export class LocationsService extends BaseService {
    #logger;

    constructor({ logger }) {
        super();

        console.log("LoggerDep:", logger);
        this.#logger = LoggerFunctionsSchema.parse(logger);
    }

    async findLocationById(id) {
        const location = await Location.findByPk(id);

        if (location === null) {
            this.#logger.warn(`[${this.getServiceMethodSignature()}] Location with ID (${id}) doesn't exist.`)
        }

        return location;
    }
}
