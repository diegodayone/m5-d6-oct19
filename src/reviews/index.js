const express = require("express")
const fs = require("fs-extra")
const path = require("path")
const router = express.Router()
const uuid = require("uuid/v4")

const filePath = path.join(__dirname, "reviews.json")

const readFile = async()=> {
    const buffer = await fs.readFile(filePath);
    return JSON.parse(buffer.toString())
}

const readFileProducts = async()=> {
    const buffer = await fs.readFile( path.join(__dirname, "../products/products.json"));
    return JSON.parse(buffer.toString())
}

router.get("/", async (req, res)=>{
   //get all reviews
   res.send(await readFile())
})

router.get("/:id", async (req, res)=>{
    //get single review
    const reviews = await readFile();
    const review = reviews.find(prod => prod._id === req.params.id)
    if (review)
        res.send(review)
    else
        res.status(404).send("Not found")
})

router.post("/", async (req, res) =>{
    //Is there any product with the given elementId?
    const products = await readFileProducts()
    if (!products.find(x => x._id === req.body.elementId))
        return res.status(404).send("Element not found")

    const toAdd = {
        ...req.body,
        createdAt: new Date(),
        updateAt: new Date(),
        _id: uuid()
    }

    const reviews = await readFile()
    reviews.push(toAdd)
    await fs.writeFile(filePath, JSON.stringify(reviews))
    res.send(toAdd)
})

router.delete("/:id", async (req, res)=>{
    const reviews = await readFile();

    const afterDelete = reviews.filter(x => x._id !== req.params.id)
    if (reviews.length === afterDelete.length)
        return res.status(404).send("NOT FOUND")
    else{
        await fs.writeFile(filePath, JSON.stringify(afterDelete))
        res.send("DELETED")
    }
 
})

router.put("/:id", async (req, res)=>{
    //Is there any product with the given elementId? 
    const products = await readFileProducts()

    if (req.body.elementId && !products.find(x => x._id === req.body.elementId))
        return res.status(404).send("Element not found")

    const reviews = await readFile();
    console.log(reviews)
    const review = reviews.find(prod => prod._id === req.params.id)
    if (review){
        delete req.body._id
        delete req.body.createdAt
        req.body.updateAt = new Date()
        const updatedVersion = Object.assign(review, req.body) //<= COPY ALL THE PROPS FROM req.body ON THE ACTUAL review!!
        const index = reviews.indexOf(review)
        reviews[index] = updatedVersion;
        await fs.writeFile(filePath, JSON.stringify(reviews))
        res.send(updatedVersion)
    }
    else
        res.status(404).send("Not found")
})


module.exports = router;