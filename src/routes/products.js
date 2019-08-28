//Modules Requireds
const express = require('express');
const router = express.Router();
const pool = require('../database');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'cma7001054591',
    api_key: '993569292918531',
    api_secret: 'fcRA2h5CNYc63xe3VIM27N6tYS4'
})


//Routes
router.get('/', async (req,res) => {
    const products = await pool.query("SELECT * FROM products");
    res.json({
        data: products,
        succes: true,
        message: "Obteniendo Productos"
    });
})

router.post('/', (req, res) => {
    const file = req.files.imagen;
    const { nombreProducto, descripcionProducto, IdCategoria } = req.body;
    cloudinary.uploader.upload(file.tempFilePath, async(err, res) => {
        if(err){
            console.log(err);
        }else{
            const newProduct = {
                nombreProducto, 
                descripcionProducto, 
                rutaCloudinary: res.url,
                publicIdCloudinary: res.public_id,
                IdEstado: 1,
                IdCategoria        
            };
            await pool.query("INSERT INTO products set ?", [newProduct] );    
            res.json({
                data: newProduct,
                succes: true,
                message: "Producto Guardado Con Éxito"
            });
        }
    })
})

router.put('/:id', async (req,res) => {
    const { id } = req.params;
    const file = req.files.imagen;
    const { nombreProducto, descripcionProducto, IdCategoria, IdEstado  } = req.body;
    const response = await pool.query("SELECT publicIdCloudinary FROM products WHERE id = ?", [ id ]);
    const json = Object.values(JSON.parse(JSON.stringify(response)));
    let publicIdCloudinary = '';
    await json.forEach(element => {
        publicIdCloudinary = element.publicIdCloudinary
    });
    cloudinary.uploader.destroy(publicIdCloudinary, async(err,res) => {
        if(err){
            console.log(err);
        }else{
            cloudinary.uploader.upload(file.tempFilePath, async(err, res) => {
                if(err){
                    console.log(err);
                }else{
                    const newProduct = {
                        nombreProducto, 
                        descripcionProducto, 
                        rutaCloudinary: res.url,
                        publicIdCloudinary: res.public_id,
                        IdEstado,
                        IdCategoria        
                    };                    
                    await pool.query("UPDATE products set ? WHERE id = ?",[ newProduct , id ]);    
                    res.json({
                        data: newProduct,
                        succes: true,
                        message: "Producto Actualizado Con Éxito"
                    });
                }
            })
        }
    })
})

router.delete('/:id', async (req,res) => {
    const { id } = req.params;
    const IdEstado = 2;
    await pool.query("UPDATE products set IdEstado = ? WHERE id = ?",[ IdEstado , id ]);    
    res.json({
        succes: true,
        message: "Producto Eliminado Con Éxito"
    });
})

module.exports = router;