/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  router.get("/:id", (req, res) => {
    const cookie = req.cookies.userID;

    const queryString = `
      SELECT * FROM tasks
      WHERE user_id = $1
      AND id = $2
      `;

    const values = [cookie, req.params.id];

    db.query(queryString, values)
      .then(data => {
        const task = data.rows[0];
        res.json({ task });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/", (req, res) => {
    const cookie = req.cookies.userID;

    const queryString = `
      SELECT * FROM tasks
      WHERE user_id = $1
      `;

    const values = [cookie];
    console.log(values);
    db.query(queryString, values)
      .then(data => {
        const tasks = data.rows;
        res.json({ tasks });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  return router;
};
