const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "db4free.net",
  user: "kavinda",
  password: "12345678",
  database: "kavinda",
});
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const query = "SELECT * FROM users WHERE username = ?";
    connection.query(query, [username], async (error, results) => {
      if (error) {
        console.error("MySQL query error:", error);
        return res.status(500).json({ message: "Error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = results[0];

      if (user.password !== password) {
        return res
          .status(401)
          .json({ message: "Authentication failed: Invalid password" });
      }

      return res.json({ message: "User Loged as " + username });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error" });
  }
});

app.listen(port, () => {
  console.log("App is running on port :", port);
});
