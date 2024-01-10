var express = require('express');
var router = express.Router();
const productModel = require("../models/productModel")
const productdataModel = require("../models/productdataModel")
/* GET home page. */
router.get('/',async function(req, res, next) {
  const product = await productModel.find()
  console.log(product)
  res.render('index', { title: 'PBL',product });
});
router.get("/addproduct",function(req,res){

  res.render("addproduct", { title: 'PBL' })
})


router.post("/addproduct",async function(req,res){
  const product = await productModel.create({
    name:req.body.productname,
    quantity:req.body.productquantity,
    instock:req.body.productstock
  })
  await product.save();
  res.redirect("/")
})

router.post("/show/:productname/data/addreal",async function(req,res){
  const productdata = await productdataModel.create({
    name:req.body.productdataname,
    type:req.body.productdatatype,
    ml:req.body.productdataml,
    expirydate:req.body.productdataexpiry
  });
  const product = await productModel.findOne({name:req.params.productname})

  product.data.push(productdata._id);
  await product.save();
  res.redirect(`/show/${req.params.productname}/data`)
})
router.post("/edit/:productname/:productdataname/data/editreal",async function(req,res){
  await productdataModel.findOneAndUpdate({name:req.params.productdataname},{
    name:req.body.editdataname,
    type:req.body.editdatatype,
    ml:req.body.editdataml,
    expirydate:req.body.editdataexpiry
  }, { new: true });

console.log("updated successfully")


  res.redirect(`/show/${req.params.productname}/data`)
})




router.get("/show/:productname/data", async function(req, res) {
  const product = await productModel.findOne({ name: req.params.productname }).populate("data");

  for (const e of product.data) {
    if(e.expirydate!=null){
    const isShortExpired = await isExpiringSoon(e.expirydate);
    
    if (isShortExpired) {
      e.shortexp=true
    } else {
      e.shortexp=false
    }
    console.log(e.shortexp);
  }


    else{
      e.expirydate = new Date().toLocaleDateString('en-GB');
      const isShortExpired = await isExpiringSoon(e.expirydate);
    
      if (isShortExpired) {
        e.shortexp=true
      } else {
        e.shortexp=false
      }
      console.log(e.shortexp);
    }
  }








  // ye alag ahi
  res.render("data", { title: 'PBL', product});


});

async function isExpiringSoon(expiryDate) {
  const oneMonthFromNow = new Date();
  oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

  return expiryDate < oneMonthFromNow;
}



router.get("/show/:productname/data/add", async function(req,res){
  const product = await productModel.findOne({name:req.params.productname})
  res.render("addproductdata.ejs",{title:"Express",product})
})
// Function to check if expiry date is 1 month from now
function isExpiringSoon(expiryDate) {
  // Calculate the date one month from now
  const oneMonthFromNow = new Date();
  oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

  // Compare expiryDate with oneMonthFromNow
  return expiryDate < oneMonthFromNow;
}

router.get("/edit/:productname/:id/data",async function(req,res){
  const productreal = await productModel.findOne({name:req.params.productname})
  const product = await productdataModel.findOne({_id:req.params.id})
  res.render("editproductdata.ejs",{title:"PBL",product,productreal})
})

module.exports = router;
