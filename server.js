const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const { urlencoded } = require("body-parser");

const app = express();
dotenv.config({ path: "./config/config.env" });
app.use(bodyParser.json());

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
  if (email === db.users[0].email && password === db.users[0].password) {
    res.json("success");
  } else {
    res.status(400).json("error logging in");
  }
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  db.users.push({
    id: "3",
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date(),
  });
  res.json(db.users[db.users.length - 1]);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
