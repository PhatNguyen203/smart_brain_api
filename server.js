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

app.post("/signin", (req, res) => {
  const { email, password } = req.body;
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password);
  database
    .transaction((trx) => {
      trx
        .insert({ email: email, has: hash })
        .into("login")
        .then((loginEmail) => {
          return trx("users")
            .returning("*")
            .insert({ email: email, name: name, joined: new Date() })
            .then((user) => res.json(user[0]));
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })
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
