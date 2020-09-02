const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const knex = require("knex");
const bcrypt = require("bcrypt-nodejs");

const app = express();
dotenv.config({ path: "./config/config.env" });
app.use(bodyParser.json());
app.use(cors());

//connect to database
const database = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "18091993",
    database: "smart_brain",
  },
});

const db = {
  users: [
    {
      id: "1",
      name: "john",
      email: "john@gmail.com",
      password: "12345",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "2",
      name: "sally",
      email: "sally@gmail.com",
      password: "113",
      entries: 0,
      joined: new Date(),
    },
  ],
};

app.get("/", (req, res) => {
  res.json(db.users);
});

app.post("/signin", (req, res) => {
  const { email, password } = req.body;
});

app.post("/register", (req, res) => {
  const { email, name, joined, password } = req.body;
  database("users")
    .returning("*")
    .insert({ email: email, name: name, joined: new Date() })
    .then((response) => res.json(response))
    .catch((error) => res.status(400).json(error.detail));
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  database("select")
    .from("users")
    .where({ id })
    .then((data) => {
      if (data.length) {
        res.json(data);
      } else {
        res.status(404).send({ error: "Not Found" });
      }
    });
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  database("user")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((data) => res.json(data[0]))
    .catch((err) => res.status(400).json("unable to get entries"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
