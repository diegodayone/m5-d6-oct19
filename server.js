const express = require("express") //import express
const productsRouter = require("./src/products")
const reviewsRouter = require("./src/reviews")
const path = require("path")
const cors = require("cors")

const server = express() //express instance

server.use(express.json())
server.use(cors())

//make the content of the images folder available for "download" under the name of /images
server.use("/images", express.static(path.join(__dirname, "images")))

// Route /products
server.use("/products", productsRouter)

// Route /reviews
server.use("/reviews", reviewsRouter)

server.get("/", (req,res)=>{
    res.send("Helloooo " + new Date())
})

server.listen(3400, ()=>{
    console.log("Server is running on 3400")
})
