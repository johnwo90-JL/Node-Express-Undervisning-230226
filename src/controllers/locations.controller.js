import z from "zod";

export function createLocationsController({ logger, locationsService }) {
    return {
        async getLocationById (req, res) {
            const result = await locationsService.findLocationById(req.validated.params.id);

            if (result === null) {
                res.sendStatus(404);
                return;
            }

            res.status(200).json(result);
        },

        async getDistanceToLocation(req, res) {
            const location = await locationsService.findLocationById(req.validated.params.id);

            const distance = locationsService.calculateDistanceToLocation(location, {
                lat: req.validated.query.lat,
                lng: req.validated.query.lng,
            });

            res.json(distance);
        }
    }
};