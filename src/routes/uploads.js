//Modules Requireds
const express = require('express');
const router = express.Router();
const path = require('path');

const rutaUpload = path.join(__dirname, '../public/uploads');

//Routes
router.get('/', (req,res) => {
    res.sendFile(rutaUpload);
})

router.get('/:img', (req,res) => {
    res.sendFile(path.join(rutaUpload, req.params.img ))
})


module.exports = router;