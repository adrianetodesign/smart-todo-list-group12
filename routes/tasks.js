/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

const { classify } = require('./classify');

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
      RETURNING *;`;

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

  router.post("/:id/delete", (req, res) => {
    // Toggles the is_archived boolean on the entry and returns
    // the updated version
    const userID = req.cookies.userID;
    const taskID = req.params.id;
    if (!userID) {
      res.redirect('/login');
      return;
    }

    const queryString = `
      UPDATE tasks
      SET is_archived = NOT is_archived
      WHERE id = $1
      AND user_id = $2
      RETURNING *;`;

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

  router.post("/:id/", (req, res) => {
    // update the category and/or body of a task
    const userID = req.cookies.userID;
    const taskID = req.params.id;

    if (!userID) {
      res.redirect('/login');
      return;
    }

    let queryString = `
      UPDATE tasks
      SET `;
    const queryParams = [userID, taskID];

    const setValues = [];
    if (req.body.body) {
      queryParams.push(req.body.body);
      setValues.push([`body = $${queryParams.length}`]);
    }
    if (req.body.category_id) {
      queryParams.push(req.body.category_id);
      setValues.push([`category_id = $${queryParams.length}`]);
    }
    queryString += setValues.join(', ');

    queryString += `
    WHERE user_id = $1
    AND id = $2
    RETURNING * ;`;

    db.query(queryString, queryParams)
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

  router.post("/", (req, res) => {
    const userID = req.cookies.userID;
    const { body, categoryID } = req.body;
    console.log('req.body', req.body);

    if (!userID) {
      res.redirect('/login');
      return;
    }

    const queryString = `
      INSERT INTO tasks (user_id, body, category_id)
      VALUES ($1, $2, $3)
      RETURNING * ;`;

    const values = [userID, body, categoryID];

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

  router.get("/classify/:searchTerm", (req, res) => {
    const searchTerm = req.params.searchTerm;

    classify(searchTerm)
      .then(data => {
        res.json(data);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
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
      AND id = $2;
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
      SELECT tasks.id AS id, category_id, name, body, time_added, is_completed
      FROM tasks
      JOIN categories ON category_id = categories.id
      WHERE user_id = $1 AND is_archived = false;
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
