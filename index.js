const express = require("express");
const path = require("path");

const app = express();

//middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes

app.get("/", (req, res) => {
  res.render("index.ejs");
});
// app.get("/", (req, res) => {
//     res.send("Hello World");
//   });

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
