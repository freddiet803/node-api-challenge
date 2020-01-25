const express = require('express');

const router = express.Router();

const db = require('../data/helpers/projectModel.js');

//get all projects
router.get('/', (req, res) => {
  db.get()
    .then(projects => {
      res.status(200).json(projects);
    })
    .catch(err => {
      res
        .status(500)
        .json({ errorMessage: 'error getting projects from database' });
    });
});

//get project by id
router.get('/:id', (req, res) => {
  const id = req.params.id;

  db.get(id)
    .then(project => {
      if (project) {
        res.status(200).json(project);
      } else {
        res
          .status(404)
          .json({ message: `project with id of ${id} does not exist` });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ errorMessage: 'error getting project from database' });
    });
});

//get project actions

router.get('/:id/actions', (req, res) => {
  const id = req.params.id;

  db.get(id)
    .then(project => {
      if (project) {
        db.getProjectActions(id)
          .then(projectActions => {
            if (projectActions.length > 0) {
              res.status(200).json(projectActions);
            } else {
              res.status(404).json({ message: 'project has no actions yet' });
            }
          })
          .catch(err => {
            res.status(500).json({ errorMessage: 'error from database' });
          });
      } else {
        res
          .status(404)
          .json({ message: `project with id of ${id} does not exist` });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ errorMessage: 'error getting project actions from database' });
    });
});

//create new project

router.post('/', (req, res) => {
  const project = req.body;
  project.completed = false;

  if (project.name && project.description) {
    db.insert(project)
      .then(newProject => {
        res.status(201).json(newProject);
      })
      .catch(err => {
        res
          .status(400)
          .json({ message: 'project could not be added to database' });
      });
  } else {
    res.status(404).json({
      message:
        'You need to have both a name and description for your new project'
    });
  }
});

//update project name and description

router.put('/:id', (req, res) => {
  const id = req.params.id;
  const updates = req.body;

  db.get(id)
    .then(project => {
      if (project) {
        if (updates.name && updates.description && updates.completed) {
          db.update(id, updates)
            .then(updatedProject => {
              res.status(201).json(updatedProject);
            })
            .catch(err => {
              res.status(500).json({ message: 'project could not be updated' });
            });
        } else {
          res.status(400).json({
            message: 'make sure you add all properties of a project to update'
          });
        }
      } else {
        res
          .status(404)
          .json({ message: `project with id of ${id} does not exist` });
      }
    })
    .catch(err => {
      res.status(500).json({ errorMessage: 'error updating project' });
    });
});

//delete a project

router.delete('/:id', (req, res) => {
  const id = req.params.id;

  db.get(id)
    .then(project => {
      if (project) {
        db.remove(id)
          .then(deleted => {
            res.status(200).json(deleted);
          })
          .catch(err => {
            res
              .status(500)
              .json({ errorMessage: 'project could not be deleted' });
          });
      } else {
        res
          .status(404)
          .json({ message: `project with id of ${id} does not exist` });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ errorMessage: 'error deleting project from database' });
    });
});

module.exports = router;
