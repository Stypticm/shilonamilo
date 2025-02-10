const express = require('express')
const lotController = require('../controllers/lotController')

const router = express.Router()

router.get('/', lotController.getAllLots)
router.get('/my-lots', lotController.getMyLots)
router.post('/create-lot', lotController.createNewLot)

module.exports = router
