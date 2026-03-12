import z from "zod";

export const GetDistanceToLocation = z.object({
    query: z.object({
        lat: z.coerce.number(),
        lng: z.coerce.number(),
    }),
});

export const GetLocationById = z.object({
    params: z.object({
        id: z.uuidv4(),
    }),
});