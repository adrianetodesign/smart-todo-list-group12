// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParser = require('cookie-parser');

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));

// Define and enable routers
const taskRoutes = require("./routes/tasks.js");
app.use("/tasks", taskRoutes(db));
const userRoutes = require("./routes/users.js");
app.use("/users", userRoutes(db));


// Define root level routes
app.get('/login', (req, res) => {
  res.cookie('userID', 1); // hard coded to log user 1 in on request
  res.redirect('/'); // redirects to static "public"
});

app.listen(PORT, () => {
  console.log(`Express running on port ${PORT}`);
});
