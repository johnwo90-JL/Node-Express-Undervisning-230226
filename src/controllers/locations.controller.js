import z from "zod";

export function createLocationsController({ logger, locationsService }) {
    return {
        async getLocationById (req, res) {
                const result = await locationsService.findLocationById(req.validated.id);
                if (result === null) {
                    res.sendStatus(404);
                    return;
                }

                res.status(200).json(result);
            }
        }
};
