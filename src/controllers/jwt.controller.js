import jwt from "jsonwebtoken";

const supersecret = "abc123";

export function createToken() {
    const token = jwt.sign({
        userId: 123,
        email: "foo@bar.com",
        roles: ["admin", "user"],
        scope: ["users"]
    }, supersecret, {
        expiresIn: "3h",
    });

    return token
}

export function verifyToken(token) {
    return jwt.verify(token, supersecret);
}

function revokeToken() {}




function createTokenPair() {}

function revokeTokenPair() {}


// POSTMAN =>
// POST /auth/login
// body: { email: string, password: string }


// SERVER =>
// password -> hashedPass
// db -> user -> knownHash

// knownHash === hashedPass ?
// if not: sendStatus(401)

// if ok: 
// authToken = createToken(); // Autentisering - i.e. "Hvem"
// refreshToken = createToken();

/*
{
    "nøkkel": "verdi"
}

- header:     *Default*-"stuff"
- payload:    Våre egne data
- signature:  "anti-tamper"

*/ 
 

