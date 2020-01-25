const express = require('express');

const router = express.Router();

const db = require('../data/helpers/actionModel.js');
const projectDB = require('../data/helpers/projectModel.js');

//get all actions
router.get('/', (req, res) => {
  db.get()
    .then(allActions => {
      res.status(200).json(allActions);
    })
    .catch(err => {
      res
        .status(500)
        .json({ errorMessage: 'could get actions from datatbase' });
    });
});

//get action by id
router.get('/:id', (req, res) => {
  const id = req.params.id;

  db.get(id)
    .then(action => {
      if (action) {
        res.status(200).json(action);
      } else {
        res.status(404).json({ message: 'action does not exist' });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ errorMessage: 'error getting action from database' });
    });
});

//create action on existing project
router.post('/project/:id', (req, res) => {
  const id = req.params.id;
  const newAction = req.body;
  newAction.completed = false;
  newAction.project_id = id;

  projectDB
    .get(id)
    .then(projectExist => {
      if (projectExist) {
        if (newAction.description && newAction.notes) {
          db.insert(newAction)
            .then(addedAction => {
              res.status(201).json(addedAction);
            })
            .catch(err => {
              res.status(500).json({
                errorMessage: `error adding action to project with id of ${id}`
              });
            });
        } else {
          res.status(400).json({
            message: 'Please provide the action with description and notes'
          });
        }
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

//update existing action on existing project
router.put('/project/:id', (req, res) => {
  const projectId = req.params.id;
  const updateAction = req.body;
  updateAction.project_id = projectId;

  projectDB
    .get(projectId)
    .then(existingProject => {
      if (existingProject) {
        if (
          updateAction.id &&
          updateAction.description &&
          updateAction.notes &&
          updateAction.completed
        ) {
          db.get(updateAction.id)
            .then(actionExist => {
              if (actionExist) {
                db.update(updateAction.id, updateAction)
                  .then(updated => {
                    res.status(201).json(updated);
                  })
                  .catch(err => {
                    res
                      .status(500)
                      .json({ errorMessage: 'could not update action' });
                  });
              } else {
                res.status(400).json({
                  message: `action with id of ${updateAction.id} does not exist`
                });
              }
            })
            .catch(err => {
              res.status(500).json({ errorMessage: 'error updating' });
            });
        } else {
          res.status(400).json({
            message:
              'You need to make sure the action has an existing id, description, notes and if it is completed'
          });
        }
      } else {
        res
          .status(404)
          .json({ message: `project with id of ${projectId} does not exist` });
      }
    })
    .catch(err => {
      res.status(500).json({ errorMessage: 'error updating project action' });
    });
});

//delete or remove existing action from existing project

router.delete('/project/:id', (req, res) => {
  const projectId = req.params.id;
  const actionToDelete = req.body.id;

  projectDB
    .get(projectId)
    .then(existingProject => {
      if (existingProject) {
        if (actionToDelete) {
          db.get(actionToDelete)
            .then(existingAction => {
              if (existingAction) {
                db.remove(actionToDelete)
                  .then(deleted => {
                    res.status(200).json(deleted);
                  })
                  .catch(err => {
                    res
                      .status(500)
                      .json({ errorMessage: 'action could not be deleted' });
                  });
              } else {
                res
                  .status(404)
                  .json({
                    message: `action with id of ${actionToDelete} does not exist`
                  });
              }
            })
            .catch(err => {
              res.status(500).json({ errorMessage: 'error finding action' });
            });
        } else {
          res
            .status(400)
            .json({ message: 'you need to have an id of an existing action' });
        }
      } else {
        res
          .status(404)
          .json({ message: `project with id of ${projectId} does not exist` });
      }
    })
    .catch(err => {
      res.status(500).json({ errorMessage: 'error finding project' });
    });
});

module.exports = router;
