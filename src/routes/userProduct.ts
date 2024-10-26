import { type PrismaClient } from "@prisma/client"
import { type Express } from "express"

const userProductRoutes = (prisma: PrismaClient) => {
    const router = require('express').Router()
    router.get('/', async (req, res) => {
        const userProduct = await prisma.userProduct.findMany()
        res.json(userProduct)
    })
    router.post('/addProduct', async (req, res) => {
        console.log(req.body)
        const { userId, productId } = req.body
        const newProduct = await prisma.userProduct.create({
            data: {
                userId,
                productId
            }
        })
        res.json(newProduct)
    })

    router.get('/products/:userId', async (req, res) => {
        const { userId } = req.params
        const dueno = await prisma.userProduct.findMany({
          where: {
            userId: parseInt(userId)
          }
        })
        res.json(dueno)
      })    
    return router
}

export default userProductRoutes