/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {

  router.post("/:id/done", (req,res) => {
    // Toggles the is_completed boolean on the entry and returns
    // the updated version
    const userID = req.cookies.userID;
    const taskID = req.params.id;

    if (!userID) {
      res.redirect('/login');
      return;
    }

    const queryString = `
      UPDATE tasks
      SET is_completed = NOT is_completed
      WHERE id = $1
      AND user_id = $2
      RETURNING *`;

    const values = [taskID, userID];

    db.query(queryString, values)
      .then(data => {
        const task = data.rows[0];
        res.json({ task });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message});
      });

  });

  router.get("/:id", (req, res) => {
    const userID = req.cookies.userID;
    if (!userID) {
      res.redirect('/login');
      return;
    }

    const queryString = `
      SELECT * FROM tasks
      WHERE user_id = $1
      AND id = $2
      `;

    const values = [userID, req.params.id];

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
    const userID = req.cookies.userID;
    if (!userID) {
      res.redirect('/login');
      return;
    }

    const queryString = `
      SELECT * FROM tasks
      WHERE user_id = $1
      `;

    const values = [userID];
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
