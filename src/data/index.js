const fs = require("fs-extra")
const path = require("path")

const productsFile = path.join(__dirname, "products.json")
const reviewsFile = path.join(__dirname, "reviews.json")

module.exports = {
    getProducts:  async () => {
        const buffer = await fs.readFile(productsFile)
        return JSON.parse(buffer.toString())
    },
    getReviews: async () => {
        const buffer = await fs.readFile(reviewsFile)
        return JSON.parse(buffer.toString())
    },
    writeProducts: async (data) => {
        await fs.writeFile(productsFile, JSON.stringify(data))
    },
    writeReview: async (data) => {
        await fs.writeFile(reviewsFile, JSON.stringify(data))
    }
}