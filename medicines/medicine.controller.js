const express = require('express');
const router = express.Router();
const Joi = require('joi');
const medicineService = require('./medicine.service');
const validateRequest = require('../_middleware/validate-request');
const authorize = require('_middleware/authorize');

module.exports = router;

router.post('/add', authorize(),addMedicine);
router.post('/delete', authorize(),deleteMedicine);
router.get('/getAll', authorize(),getAll);
router.post('/get', authorize(),getByName);

function addMedicine(req, res, next){
    medicineService.addMedicine(req.body)
        .then(medicines => res.json(medicines))
        .catch(next);
}

function deleteMedicine(req, res, next){
    medicineService.deleteMedicine(req.body)
        .then(medicines => res.json(medicines))
        .catch(next);
}

function getAll(req, res, next){
    medicineService.getAll()
        .then(medicines => res.json(medicines))
        .catch(next);
}

function getByName(req, res, next){
    medicineService.getByName(req.body)
        .then(medicines => res.json(medicines))
        .catch(next);
}