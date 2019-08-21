//Modules Requireds
const express = require('express');
const router = express.Router();
const path = require('path');

const pool = require('../database');

const rutaUpload = path.join(__dirname, '../public/uploads');

//Routes
router.get('/', async (req,res) => {
    const categorias = await pool.query("SELECT * FROM categoria");
    res.json({
        data: categorias,
        succes: true,
        message: "Obteniendo Categorias"
    });
})


module.exports = router;