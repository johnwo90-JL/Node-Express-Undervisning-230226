import { syncDatabase } from "../src/db/sqlite.db.js";
import { User } from "../src/models/user.model.js";



await syncDatabase();

const emails = ["foo@bar.com", "alice@bar.com", "thor@bar.com", "joe@bar.com"];
const names = ["Foo", "Alice", "Thor", "Joe"];

for (const email of emails) {
    const roles = ["user"];
    
    if (names.length % 2 === 0) {
        roles.push("admin");
    }

    const newUser = {
        email,
        name: names.pop(),
        password: "foobar",
        roles
    };

    await User.create(newUser);
    console.log("Created user:", email);
}