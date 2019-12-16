const express = require("express")
const fs = require("fs-extra")
const path = require("path")
const router = express.Router()
const uuid = require("uuid/v4")
const multer = require("multer")
const { check, validationResult, sanitizeBody } = require("express-validator")
const { getProducts, getReviews, writeProducts } = require("../data")

// const filePath = path.join(__dirname, "products.json")

// const readFile = async()=> {
//     const buffer = await fs.readFile(filePath);
//     return JSON.parse(buffer.toString())
// }

// const readFileReviews = async()=> {
//     const buffer = await fs.readFile(path.join(__dirname, "../reviews/reviews.json"));
//     return JSON.parse(buffer.toString())
// }

//?category=...
router.get("/", async (req, res)=>{
   //get all products
   const products = await getProducts()
   if (req.query.category)
        res.send(products.filter(product => product.category === req.query.category))
   else
        res.send(products)
})

router.get("/:id", async (req, res)=>{
    //get single product
    const products = await getProducts();
    const product = products.find(prod => prod._id === req.params.id)
    if (product)
        res.send(product)
    else
        res.status(404).send("Not found")
})

router.get("/:id/reviews", async (req, res) =>{
    const reviews = await getReviews();
    res.send(reviews.filter(r => r.elementId === req.params.id))
})

router.post("/", 
[check("name").isLength({ min: 4 }).withMessage("Name should have at least 4 chars"),
 check("category").exists().withMessage("Category is missing"),
 check("description").isLength({ min: 50, max: 1000}).withMessage("Description must be between 50 and 1000 chars"),
 check("price").isNumeric().withMessage("Must be a number"),
 sanitizeBody("price").toFloat()] ,
 async (req, res) =>{
    const errors = validationResult(req)
    if (!errors.isEmpty())
        return res.status(404).send(errors)

    const toAdd = {
        ...req.body,
        createdAt: new Date(),
        updateAt: new Date(),
        _id: uuid()
    }

    const products = await getProducts()
    products.push(toAdd)
    await writeProducts(products)
    res.send(toAdd)
})

const multerConfig = multer({})
router.post("/:id/upload", multerConfig.single("prodPic"), async (req, res)=>{
    //we need to check if we have an existing product with the given id
    const products = await getProducts();
    const product = products.find(prod => prod._id === req.params.id)
    if (product)
    {
        const fileDest = path.join(__dirname,"../../images/", req.params.id + path.extname(req.file.originalname))
        await fs.writeFile(fileDest, req.file.buffer)
        product.updateAt = new Date();
        product.imageUrl = "/images/" + req.params.id + path.extname(req.file.originalname);
        await writeProducts(filePath, products)
        res.send(product)
    }
    else
        res.status(404).send("Not found")
})

router.delete("/:id", async (req, res)=>{
    const products = await readFile();
    //[4, 5, 6, 1, 2]
    // we have to delete 6!
    // => take everything that is not 6!
    //[4, 5, 1, 2]
    // we have to delete 3!
    // ok, but in the new array, we have the same number of elements =>> 3 was not there!
    const afterDelete = products.filter(x => x._id !== req.params.id)
    if (products.length === afterDelete.length)
        return res.status(404).send("NOT FOUND")
    else{
        await writeProducts(afterDelete)
        res.send("DELETED")
    }
 
})

router.put("/:id", async (req, res)=>{
    const products = await readFile();
    console.log(products)
    const product = products.find(prod => prod._id === req.params.id)
    if (product){
        delete req.body._id
        delete req.body.createdAt
        req.body.updateAt = new Date()
        const updatedVersion = Object.assign(product, req.body) //<= COPY ALL THE PROPS FROM req.body ON THE ACTUAL PRODUCT!!
        const index = products.indexOf(product)
        products[index] = updatedVersion;
        await writeProducts(products)
        res.send(updatedVersion)
    }
    else
        res.status(404).send("Not found")
})


module.exports = router;