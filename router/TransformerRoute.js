
const router = require('express').Router();
const transformerControl = require('../control/TransformerControl'); 
const multer = require('multer');
const {isLoggedIn} = require('../utils/isLoggedIn')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './files')
    },
    filename: function (req, file, cb) {
        cb(null, Math.floor(Math.random() * 1000).toString() + '-' + file.originalname);
    }
});

const upload = multer({storage:storage}); 
const transformerFiles = upload.array("files");

router.post('/alltransformer',isLoggedIn,transformerFiles ,transformerControl.CreateTransformer); 
router.get('/alltransformer',isLoggedIn,transformerControl.allTransformer); 
router.put('/alltransformer/:id',isLoggedIn,transformerFiles,transformerControl.editTransformer); 
router.delete('/alltransformer/:id',isLoggedIn,transformerControl.DeleteTransformer); 
router.post('/alltransformer/:id',isLoggedIn,transformerControl.getOneTransformer);

module.exports = router;