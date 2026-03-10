import express from "express";
import { useRequestId } from "../middlewares/use-request-id.middleware.js";
import { useValidation } from "../middlewares/use-validation.middleware.js";
import { GetLocationById } from "../schema/location.schema.js";


export function createLocationsRouter({ locationsController, authMiddlewares }) {
    const router = express.Router();

    router.use(useRequestId);

    router.get("/:id", useValidation(GetLocationById), locationsController.getLocationById);
    return router;
}
