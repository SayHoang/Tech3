import bcrypt from "bcrypt";

export const up = async (db, client) => {
  await db.collection("users").insertMany([
    {
      username: "admin",
      password: bcrypt.hashSync("123123", 10),
      role: "admin",
    },
    {
      username: "alice",
      password: bcrypt.hashSync("123123", 10),
      role: "customer",
    },
    {
      username: "bob",
      password: bcrypt.hashSync("123123", 10),
      role: "customer",
    },
  ]);
};

export const down = (db, client) => {};
