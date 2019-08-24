//Modules Requireds
const express = require('express');
const router = express.Router();
const path = require('path');

const pool = require('../database');

const rutaUpload = path.join(__dirname, '../public/uploads');

//Routes
router.get('/', async (req,res) => {
    const estados = await pool.query("SELECT * FROM estado");
    res.json({
        data: estados,
        succes: true,
        message: "Obteniendo Estados"
    });
})


module.exports = router;