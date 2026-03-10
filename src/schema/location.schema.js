import z from "zod";

export const GetNearestLocation = z.object({
    query: z.object({
        lat: z.number(),
        lon: z.number(),
    }),
});

export const GetLocationById = z.object({
    params: z.object({
        id: z.uuidv4(),
    }),
});