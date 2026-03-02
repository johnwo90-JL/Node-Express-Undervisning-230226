import { randomUUID } from "node:crypto";

export function useRequestId(req, res, next) {
    const reqId = randomUUID();

    req.requestId = reqId;
    console.log("[Middleware] Request ID:", reqId);

    next();
}
