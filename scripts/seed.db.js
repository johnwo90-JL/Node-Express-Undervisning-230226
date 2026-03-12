import { syncDatabase } from "../src/db/sqlite.db.js";
import { Location, User } from "../src/models/index.js";

await syncDatabase();

// Destroy any current data
User.destroy({ where: {} });
Location.destroy({ where: {} });


// Add users
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
        password: "foobar1234!!",
        roles
    };

    await User.create(newUser);
    console.log("Created user:", email);
}

// Add locations
const locations = [{
    label: "Lyderhorn",
    description: "396 m.o.h.",
    latitude: 60.373874472822436,
    longitude: 5.241958967778432,
    difficulty: 2,
}, {
    label: "Damsgårdsfjellet",
    description: "317 m.o.h.",
    latitude: 60.377347,
    longitude: 5.291319,
    difficulty: 2,
}, {
    label: "Løvstakken",
    description: "477 m.o.h.",
    latitude: 60.360637,
    longitude: 5.319017,
    difficulty: 4,
}, {
    label: "Ulriken",
    description: "643 m.o.h.",
    latitude: 60.377500,
    longitude: 5.386950,
    difficulty: 4,
}, {
    label: "Fløyen",
    description: "400 m.o.h.",
    latitude: 60.394444,
    longitude: 5.343333,
    difficulty: 1,
}, {
    label: "Rundemanen",
    description: "568 m.o.h.",
    latitude: 60.413130,
    longitude: 5.366540,
    difficulty: 3,
}, {
    label: "Sandviksfjellet",
    description: "417 m.o.h.",
    latitude: 60.409490,
    longitude: 5.340580,
    difficulty: 3,
}];

Location.bulkCreate(locations);
