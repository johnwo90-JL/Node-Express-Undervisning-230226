const requiredFunctions = [
    "log",
    "info",
    "warn",
    "error",
];


export class LoggerService {
    #fn = {};

    constructor(functions) {
        if (!functions || !requiredFunctions.map(e => this.#fn[e] = functions[e]).every(e => !!e)) {
            throw new Error(`Logger service is missing dependency (functions): ${functions ? JSON.stringify(requiredFunctions.map(e => this.#fn[e] = functions[e]), null, 4) : "(Undefined)"}`);
        }
    }

    log(...args) {
        this.#fn["log"](...args);
    }

    info(...args) {
        this.#fn["info"](...args);
    }

    warn(...args) {
        this.#fn["warn"](...args);
    }

    error(...args) {
        this.#fn["error"](...args);
    }

    
}
