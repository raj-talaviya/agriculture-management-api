const adminmodel=require('../model/adminmodel')
const promodel=require('../model/product')
const regmodel=require('../model/user_reg')
const cartmodel=require('../model/cart')
const ordermodel=require('../model/ordermodel')
const bcrypt=require('bcrypt')
const storage = require('node-persist');

storage.init( /* options ... */ );

// Registration 
exports.register=async (req,res) => {
    var b_pass=await bcrypt.hash(req.body.password,10)
    req.body.password=b_pass

    var data=await regmodel.create(req.body)
    res.status(200).json({
        data,
        status:"Registration Successful"
    })
}

// User Login
exports.userlogin=async(req, res)=>{
    var data=await regmodel.find({"email":req.body.email})
    var login_status=await storage.getItem('user_id')
    if(login_status==undefined)
    {
        if(data.length==1)
        {   
            bcrypt.compare(req.body.password,data[0].password,async function(err, result) {
                if(result==true)
                {
                    console.log(await storage.setItem('user_id',data[0].id))
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
            status:"User Already Login"
        })
    }
}

// User Logout
exports.userlogout=async (req,res)=>{
    storage.removeItem("user_id")
    res.status(200).json({
        status:"User Logout"
    })
}

// View Product
exports.view_product=async (req,res)=>{
    var login_status=await storage.getItem('user_id')

    if(login_status!=undefined) {
        var data=await promodel.find()
        res.status(200).json({
            data
        }) 
    }else{
        res.status(200).json({
            status:"Please Login"
        }) 
    }
}

// Add to Cart
exports.add_cart=async (req,res)=>{
    var login_status=await storage.getItem('user_id')

    if(login_status!=undefined) {
        var id=req.params.id
        var data=await promodel.findById(id)

        var cartData=await cartmodel.create({"name":data.name,"price":data.price,"qty":req.body.qty,"total":data.price*req.body.qty})
        res.status(200).json({
            status:"Product Added to Cart"
        })
    }else{
        res.status(200).json({
            status:"Please Login"
        })
    }  
}

// Buy Product
exports.buy_product=async (req,res) => {
    var login_status=await storage.getItem('user_id')

    if(login_status!=undefined) {
        var id=req.params.id
        var find_product=await cartmodel.findById(id)
        var cart_delete=await cartmodel.findByIdAndDelete(id,req.body)

        var buy=await ordermodel.create({"name":find_product.name,"price":find_product.price,"qty":find_product.qty,"total":find_product.total,"email":req.body.email})
        res.status(200).json({
            status:"Oredr Placed Successfully"
        })
    }else{
        res.status(200).json({
            status:"Please Login"
        })
    }  
}

// View Oredr
exports.view_order=async (req,res) => {
    var login_status=await storage.getItem('user_id')

    if(login_status!=undefined) {
        var data=await regmodel.find()

        if(data.length>0){
            var get_order=await ordermodel.find({"email":req.body.email}) 
            
            if(get_order.length>0){
                res.status(200).json({
                    get_order
                })
            }else{
                res.status(200).json({
                    status:"Order Not Found"
                })
            }
        }
    }else{
        res.status(200).json({
            status:"Please Login"
        })
    }  
}

// View Bill
exports.view_bill=async (req,res) => {
    var id=req.params.id
    var data=await ordermodel.find()
    var total=0
    
    for(var i in data){
        total=total+parseInt(data[i].total)
        console.log(data[i].total)
    }
    
    res.status(200).json({
        status:"Total Bill Amount :" +total,
    })
}

// View User Cancel Order
exports.order_cancel=async(req,res)=>{
    var login_status=await storage.getItem('user_id')

    if (login_status != undefined) {
        var id = req.params.id;
        // Fetch __v from the database
        var existingData = await ordermodel.findById(id);
        var __v = await existingData.__v;
        
        var sta;
        if (__v == 2) {
            sta = "Canceled";
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
