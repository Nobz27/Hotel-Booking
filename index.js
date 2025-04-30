const express = require("express");
const path = require("path");
const mysql = require("mysql"); // connecting my database
const bcrypt = require("bcrypt");
const session = require("express-session");

const dbConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "hotel_lobo",
});

const app = express();

//middleware
app.use(express.static(path.join(__dirname, "public"))); // path -- nested routs /booking/user/id
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //for parsing application/x-www-form-urlencoded - form data

//routes

app.get("/", (req, res) => {
  dbConnection.query("SELECT * FROM rooms", (roomsSelectError, rooms) => {
    if (roomsSelectError) {
      res.status(500).send("server Error:500");
    } else {
      dbConnection.query("SELECT * FROM spots", (spotsSelectError, spots) => {
        if (spotsSelectError) {
          res.status(500).send("Server Error: 500");
        } else {
          console.log(spots);
          res.render("index.ejs", { rooms, spots });
        }
      });
    }
  });
});
// app.get("/", (req, res) => {
//     res.send("Hello World");
//   });

app.post("/login", (req, res) => {
  const { email, password } = req.body;
});
//  dbConnection.query('SELECT * FROM users WHERE email = ?', [email], async (err, results)
//       if (err|| results.length === 0) return res.status(404).send('invalid Credentials')

//         const user = results[0];
//         const validPass = await bcrypt.compare(password, user.password)
//         if(!validPass) return res.status(401).send('incorrect password')
//           req.session.user = {
//         id:user.id,
//         email: user.email,
//         role:user.role,
//           }
// )
app.listen(3000, () => {
  console.log("server is running on port 3000");
});
