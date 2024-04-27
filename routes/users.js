var express = require('express');
var router = express.Router();
var user=require('../controller/usercontroller')

router.post('/register',user.register)
router.post('/login',user.userlogin)
router.get('/logout',user.userlogout)

router.get('/viewproduct',user.view_product)
router.get('/addcart/:id',user.add_cart)
router.get('/viewbill',user.view_bill)

router.get('/buyproduct/:id',user.buy_product)
router.get('/vieworder',user.view_order)
router.post('/cancelorder/:id',user.order_cancel)


module.exports = router;
