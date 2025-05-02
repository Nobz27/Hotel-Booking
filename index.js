const express = require("express");
const path = require("path");
const mysql = require("mysql"); // connecting my database
const bcrypt = require("bcrypt");
const session = require("express-session");
const { log } = require("console");

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
app.use(
  session({
    secret: "ujipower", //secret key for signing the session ID cookie
    resave: false, // forces session to be saved back to the session store, even is the session was modified
    saveUninitialized: true, // forces a session that is "Uninitialized" to be saved to the store
  })
);
// authorization middleware
const superAdminRoutes = ["/newSpot", "/newRoom", "/checkout"];
const receptionistRoutes = ["/checkout", "/checkin", "/roomUpdates"];
const managerRoutes = ["/addReceptionist", "/roomUpdates"];

//all other routes are public
app.use((req, res, next) => {
  if (req.session.user) {
    //user islogged in --- go head and check role and route they are accessing
    const userRole = req.session.user.role; // get user role from session
    if (userRole === "superadmin" && superAdminRoutes.includes(req.path)) {
      next();
    } else if (
      userRole === "reception" &&
      receptionistRoutes.includes(req.path)
    ) {
      next();
    } else if (userRole === "manager" && managerRoutes.includes(req.path)) {
      next();
    }
  } else {
    //user is not logged in
    if (
      superAdminRoutes.includes(req.path) ||
      receptionistRoutes.includes(req.path)
    ) {
      res.status(401).send("Unauthorized - 401");
    } else {
      next();
    }
  }
});

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
app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/newSpot", (req, res) => {
  res.render("newSpot.ejs");
});

app.get("/newRoom", (req, res) => {
  res.render("newRoom.ejs");
});

app.get("/checkout", (req, res) => {
  res.render("checkout.ejs");
});

app.get("/addReceptionist", (req, res) => {
  res.render("addReceptionist.ejs");
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  dbConnection.query(
    `SELECT * FROM users WHERE email="${email}"`,
    (error, userData) => {
      if (error) {
        res.status(500).send("server Error:500");
      } else {
        if (userData.length == 0) {
          res.status(401).send("User not found");
        } else {
          // user found - check password
          const user = userData[0];
          // res.json(user); sends data to the browser which we don t want
          const isPasswordValid = bcrypt.compareSync(password, user.password);
          if (isPasswordValid) {
            // password is valid - create session - express session middleware
            req.session.user = user; // creating a session
            res.send("login successful - valid password");
          } else {
            //password is invalid
            res.status(401).send("Invalid password");
          }
        }
      }
    }
  );
});
// console.log(bcrypt.hashSync("admin758", 3)); // hash password for testing
// console.log(bcrypt.hashSync("admin245", 2));
console.log(bcrypt.hashSync("admin123", 1));

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
