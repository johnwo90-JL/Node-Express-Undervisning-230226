

export function createLocationsController({ logger, locationsService }) {
    return {
        getLocationById(id) {
            return async (req, res) => {
                const result = await locationsService.findLocationById(id);
                res.json(result);
            }
        }
    }
};
