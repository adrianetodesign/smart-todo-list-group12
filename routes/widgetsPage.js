/*
 * All EJS routes for Widgets are defined here
 * Since this file is loaded in server.js into /widgets,
 * Not a great name for a route file! 
*/

const express = require('express');
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {

    // Just display the widgets ejs page
    res.render("widgets");
  });
  return router;
};
