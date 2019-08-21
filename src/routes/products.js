//Modules Requireds
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const uuid = require('uuid/v4');
const fs = require('file-system');

const pool = require('../database');

const rutaUpload = path.join(__dirname, '../public/uploads');

//Middlewares
const storage = multer.diskStorage({
    destination: rutaUpload,
    filename: (req,file, cb) => {
        cb(null, uuid() + path.extname(file.originalname).toLocaleLowerCase());
    }
})

const upload = multer({
    storage,
    dest: rutaUpload,
    fileFilter: (req,file,cb) =>{
        const fileTypes= /jpeg|jpg|png|gif/
        const mimetype = fileTypes.test(file.mimetype);
        const extName = fileTypes.test(path.extname(file.originalname));
        if(mimetype && extName){
            return cb(null,true);
        }
        cb("Error: Archivo debe ser una imágen válida");
    }
}).single('file')

//Routes
router.get('/', async (req,res) => {
    const products = await pool.query("SELECT * FROM products");
    res.json({
        data: products,
        succes: true,
        message: "Obteniendo Productos"
    });
})

router.post('/', upload , async (req, res) => {
    const { nombreProducto, descripcionProducto, IdCategoria } = req.body;
    const newProduct = {
        nombreProducto, 
        descripcionProducto, 
        nombreArchivo: req.file.filename,
        IdEstado: 1,
        IdCategoria        
    };
    await pool.query("INSERT INTO products set ?", [newProduct] );    
    res.json({
        data: newProduct,
        succes: true,
        message: "Producto Guardado Con Éxito"
    });
})

router.post('/:id', async (req,res) => {
    const { id } = req.params;
    const product = await pool.query("SELECT * FROM products WHERE id = ?", [ id ]);
    console.log(product);
    res.send(product);
})

router.put('/:id', async (req,res) => {
    const { id } = req.params;
    console.log("Se editó el producto con exito" + id);
})

router.delete('/:id', async (req,res) => {
    const { id } = req.params;
    const response = await pool.query("SELECT nombreArchivo FROM products WHERE id = ?", [ id ]);
    const rutaArchivo = path.join(__dirname,"../public/uploads/"+response[0].nombreArchivo);
    fs.unlink(rutaArchivo, (err) => {
        if(err){
            console.log("Surgió un error");
        }else{
            console.log(rutaArchivo+" ha sido eliminado");
        }
    })
    await pool.query("DELETE FROM products WHERE id = ?",[ id ]);
    res.redirect("/products");
})

module.exports = router;