const express = require('express');
const router = express.Router();
const jokesController = require('../controllers/jokes');

router.get('/', jokesController.getAllJokes);
router.get('/random', jokesController.getRandomJoke); // ANTES de /:id
router.get('/:id', jokesController.getJokeById);
router.post('/', jokesController.createJoke);
router.put('/:id', jokesController.updateJoke);
router.delete('/:id', jokesController.deleteJoke);

module.exports = router;
