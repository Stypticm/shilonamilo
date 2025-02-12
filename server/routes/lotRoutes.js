const express = require('express')
const lotController = require('../controllers/lotController')

const router = express.Router()

router.get('/', lotController.getAllLots)
router.get('/my-lots', lotController.getMyLots)
router.post('/create-lot', lotController.createNewLot)
router.get('/lot/:lotId', lotController.getLotById)
router.get('/lot-ids', lotController.getLotIds)
router.get('/lot-owner', lotController.getLotOwner)
router.get(
  '/lot-by-user-id-and-lot-id',
  lotController.getLotByUserIdLotId
)
router.delete('/lot/:lotId', lotController.deleteLot)
router.put('/lot/:lotId', lotController.updateLot)

module.exports = router
