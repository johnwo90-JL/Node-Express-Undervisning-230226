import bcrypt from "bcrypt";

// Authentication schemes:
// JWT
// ...

// BASIC
// header.Authorization = Buffer.from(`${user}:${password}`).toString("base64");

// Middleware ? JWT : BASIC
// Middleware - Inndatavalidering

//TODO refactor to separate service >>
export function hashPassword(password) {
    return bcrypt.hash(password, 10);
}

export function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
}
//TODO <<