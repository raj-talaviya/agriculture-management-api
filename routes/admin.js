const admin=require('../controller/admincontroller')
const express = require('express');
const router = express.Router();

router.post('/addadmin',admin.addadmin)

router.post('/adminlogin',admin.adminlogin)
router.get('/adminlogout',admin.adminlogout)

// Category
router.post('/addcategory',admin.category)
router.get('/viewcategory',admin.viewcategory)
router.post('/updatecategory/:id',admin.updatecategory)
router.get('/deletecategory/:id',admin.deletecategory)

// Product
router.post('/addproduct',admin.addproduct)
router.get('/viewproduct',admin.viewproduct)
router.post('/updateproduct/:id',admin.updateproduct)
router.get('/deleteproduct/:id',admin.deleteproduct)

// View User
router.get('/viewuser',admin.view_user)

// View Order
router.get('/vieworder',admin.view_order)

// View Pending Order
router.get('/pendingorder',admin.pending_oredr)

// View Cancel Order
router.get('/cancelorder',admin.cancel_oredr)

// View Income
router.get('/income',admin.view_income)

// Accept Order
router.post('/acceptorder/:id',admin.order_accept)

module.exports =router