const express = require('express')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const uploadControler = require('../controllers/uploadController')
const router = express.Router()

router.post('/upload', upload.array("files"), uploadControler.upload)

module.exports = router;