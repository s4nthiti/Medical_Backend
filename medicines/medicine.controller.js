const express = require('express');
const router = express.Router();
const Joi = require('joi');
const medicineService = require('./medicine.service');
const validateRequest = require('../_middleware/validate-request');

module.exports = router;

router.post('/add', addMedicine);
router.post('/delete', deleteMedicine);
router.get('/getAll', getAll);
router.post('/get', getByName);

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