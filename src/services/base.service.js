import { getFunctionName } from "../utils/functions.utils.js";

export class BaseService {
    constructor() { }

    getServiceMethodSignature(pattern = "$class->$method") {
        return pattern
            .replaceAll("$class", this.constructor.name)
            .replaceAll("$method", getFunctionName({ skip: 1 }));
    }
}
