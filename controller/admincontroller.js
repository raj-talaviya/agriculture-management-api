const adminmodel=require('../model/adminmodel')
const catmodel=require('../model/category')
const ordermodel = require('../model/ordermodel')
const promodel=require('../model/product')
const regmodel=require('../model/user_reg')
const bcrypt=require('bcrypt')
const storage = require('node-persist');

storage.init( /* options ... */ );

exports.addadmin=async(req,res)=>{
    var b_pass=await bcrypt.hash(req.body.password,10)

    req.body.password=b_pass
    var data=await adminmodel.create(req.body)
    res.status(200).json({
        data,
        status:"Admin Add"
    })
}

// Admin Login
exports.adminlogin=async(req, res)=>{
    var data =await adminmodel.find({"email":req.body.email})
    var login_status=await storage.getItem('admin_id')
    if(login_status==undefined)
    {
        if(data.length==1)
        {   
            bcrypt.compare(req.body.password,data[0].password,async function(err, result) {
                if(result==true)
                {
                    console.log(await storage.setItem('admin_id',data[0].id))
                    res.status(200).json({
                        status:"Login Successful"
                    })
                }
                else{
                    res.status(200).json({
                        status:"Check your Email and Password"
                    })
                }
            });
        }else{
            res.status(200).json({
                status:"Check your Email and Password"
            })
        }
    }else{
        res.status(200).json({
            status:"Admin Already Login"
        })
    }
}

// Admin Logout
exports.adminlogout=async (req,res)=>{
    storage.removeItem("admin_id")
    res.status(200).json({
        status:"Admin Logout"
    })
}

// Add Category
exports.category=async (req,res)=>{
    var login_status=await storage.getItem('admin_id')

    if(login_status!=undefined) {
        var data = await catmodel.create(req.body)
        res.status(200).json({
            data,
            status:"Category Added"
        })
    }else{
        res.status(200).json({
            status:"Please Login"
        })
    }
}

// View Category
exports.viewcategory=async (req,res)=>{
    var login_status=await storage.getItem('admin_id')

    if(login_status!=undefined) {
        var data= await catmodel.find()
        res.status(200).json({
            data
        })
    }else{
        res.status(200).json({
            status:"Please Login"
        })
    }
}

// Update Category
exports.updatecategory=async (req,res)=>{
    var login_status=await storage.getItem('admin_id')

    if(login_status!=undefined) {
        var id=req.params.id
        var data= await catmodel.findByIdAndUpdate(id,req.body)
        res.status(200).json({
            status:"Category Updated"
        })
    }else{
        res.status(200).json({
            status:"Please Login"
        })
    }
}

// Delete Category
exports.deletecategory=async (req,res)=>{
    var login_status=await storage.getItem('admin_id')

    if(login_status!=undefined) {
        var id=req.params.id
        var data= await catmodel.findByIdAndDelete(id,req.body)
        res.status(200).json({
            status:"Category Deleted"
        })
    }else{
        res.status(200).json({
            status:"Please Login"
        })
    }
}

// Add Product
exports.addproduct=async (req,res)=>{
    var login_status=await storage.getItem('admin_id')

    if(login_status!=undefined) {
        var data=await promodel.create(req.body)
        res.status(200).json({
            data,
            status:"Product Added"
        })
    }else{
        res.status(200).json({
            status:"Please Login"
        }) 
    }
}

// View Product
exports.viewproduct=async (req,res)=>{
    var login_status=await storage.getItem('admin_id')

    if(login_status!=undefined) {
        var data=await promodel.find().populate("cat_id")
        res.status(200).json({
            data
        }) 
    }else{
        res.status(200).json({
            status:"Please Login"
        }) 
    }
}

// Update Product
exports.updateproduct=async (req,res)=>{
    var login_status=await storage.getItem('admin_id')

    if(login_status!=undefined) {
        var id=req.params.id
        var data= await promodel.findByIdAndUpdate(id,req.body)
        res.status(200).json({
            status:"Product Updated"
        })
    }else{
        res.status(200).json({
            status:"Please Login"
        })
    }
}

// Delete Product
exports.deleteproduct=async (req,res)=>{
    var login_status=await storage.getItem('admin_id')

    if(login_status!=undefined) {
        var id=req.params.id
        var data= await promodel.findByIdAndDelete(id,req.body)
        res.status(200).json({
            status:"Product Deleted"
        })
    }else{
        res.status(200).json({
            status:"Please Login"
        })
    }
}

// View User
exports.view_user=async (req,res)=>{
    var login_status=await storage.getItem('admin_id')

    if(login_status!=undefined) {
        var data=await regmodel.find()
        res.status(200).json({
            data
        }) 
    }else{
        res.status(200).json({
            status:"Please Login"
        }) 
    }
}


// View Order
exports.view_order=async (req,res) => {
    var login_status=await storage.getItem('admin_id')

    if(login_status!=undefined) {
        var data = await ordermodel.find()

        res.status(200).json({
            data
        })
    }else{
        res.status(200).json({
            status:"Please Login"
        })
    }
}

// View Pending Order
exports.pending_oredr=async (req,res) =>{
    var login_status=await storage.getItem('admin_id')

    if(login_status!=undefined) {

        var data = await ordermodel.find({"__v":0})

            res.status(200).json({
                data
            })
    }else{
        res.status(200).json({
            status:"Please Login"
    })
}
}

// View Cancel Order
exports.cancel_oredr=async (req,res) =>{
    var login_status=await storage.getItem('admin_id')

    if(login_status!=undefined) {

        var data = await ordermodel.find({"__v":2})

            res.status(200).json({
                data
            })
    }else{
        res.status(200).json({
            status:"Please Login"
    })
}
}

// View income
exports.view_income=async (req,res) =>{
    var login_status=await storage.getItem('admin_id')

    if(login_status!=undefined) {
        var data=await ordermodel.find({$or: [{ "__v": 1 }, { "__v": 3 }]})

        var total=0

        for (var i in data){
            total = total+parseInt(data[i].price)*parseInt(data[i].qty)
        }

        res.status(200).json({
            status:"Total Income : "+total
        })
    }else{
        res.status(200).json({
            status:"Please Login"
        })
    }
}

// Admin Accecpt Order
exports.order_accept=async(req,res)=>{
    var login_status=await storage.getItem('admin_id')

    if (login_status != undefined) {
        var id = req.params.id;
        // Fetch __v from the database
        var existingData = await ordermodel.findById(id);
        
        var __v = await existingData.__v;
        
        var sta;
        if (__v == 0) {
            sta = "Pending";
        }else if (__v == 1) {
            sta = "Accepted";
        }else if(__v == 2){
            sta = "Cancel";
        }else if(__v==3){
            sta="Delivered"
        }
        
        // Include sta in req.body
        req.body.sta = sta;
        
        // Update document with new sta
        var data = await ordermodel.findByIdAndUpdate(id,req.body);

        res.status(200).json({
            status: "Order Updated",
            newStatus: sta
        });
    }
    else{
    res.status(200).json({
        status:"Please Login"
    })
}
}