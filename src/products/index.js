const express = require("express")
const fs = require("fs-extra")
const path = require("path")
const router = express.Router()
const uuid = require("uuid/v4")

const filePath = path.join(__dirname, "products.json")

const readFile = async()=> {
    const buffer = await fs.readFile(filePath);
    return JSON.parse(buffer.toString())
}


router.get("/", async (req, res)=>{
   //get all products
   res.send(await readFile())
})

router.get("/:id", async (req, res)=>{
    //get single product
    const products = await readFile();
    const product = products.find(prod => prod._id === req.params.id)
    if (product)
        res.send(product)
    else
        res.status(404).send("Not found")
})

router.post("/", async (req, res) =>{
    const toAdd = {
        ...req.body,
        createdAt: new Date(),
        updateAt: new Date(),
        _id: uuid()
    }

    const products = await readFile()
    products.push(toAdd)
    await fs.writeFile(filePath, JSON.stringify(products))
    res.send(toAdd)
})

router.delete("/:id", async (req, res)=>{
    const products = await readFile();
    const afterDelete = products.filter(x => x._id !== req.params.id)
    if (products.length === afterDelete.length)
        return res.status(404).send("NOT FOUND")
    else{
        await fs.writeFile(filePath, JSON.stringify(afterDelete))
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
        await fs.writeFile(filePath, JSON.stringify(products))
        res.send(updatedVersion)
    }
    else
        res.status(404).send("Not found")
})


module.exports = router;