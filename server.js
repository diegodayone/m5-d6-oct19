const express = require("express") //import express
const productsRouter = require("./src/products")

const server = express() //express instance

server.use(express.json())

// Route /products
server.use("/products", productsRouter)

// Route /reviews

server.get("/", (req,res)=>{
    res.send("Helloooo " + new Date())
})

server.listen(3400, ()=>{
    console.log("Server is running on 3400")
})
