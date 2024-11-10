import { type PrismaClient } from "@prisma/client"
import { type Express } from "express"

const houseProductRoutes = (prisma: PrismaClient) => {
    const router = require('express').Router()
    router.get('/', async (req, res) => {
        const houseProduct = await prisma.houseProduct.findMany()
        res.json(houseProduct)
    })
    router.post('/addProduct', async (req, res) => {
        console.log(req.body)
        const {productId, name, houseId } = req.body
        //Si el producto ya existe en la casa, aumentar la cantidad
        const existingProduct = await prisma.houseProduct.findFirst({
            where: {
                houseId,
                productId
            }
        })
        if (existingProduct) {
            const updatedProduct = await prisma.houseProduct.update({
                where: {
                    id: existingProduct.id
                },
                data: {
                    quantity: existingProduct.quantity + 1
                }
            })
            res.json(updatedProduct)
        }
        else {
        //Si no existe, crearlo
          const newProduct = await prisma.houseProduct.create({
              data: {
                  houseId,
                  productId,
                  name,
                  quantity: 1
              }
          })

          res.json(newProduct)
      }
    })

    router.post('/deleteProduct', async (req, res) => {
        console.log(req.body)
        const {productId, name, houseId } = req.body
        //disminuir en 1 la cantidad del producto
        const existingProduct = await prisma.houseProduct.findFirst({
            where: {
                houseId,
                productId
            }
        })
        if (existingProduct) {
            if (existingProduct.quantity > 1) {
                const updatedProduct = await prisma.houseProduct.update({
                    where: {
                        id: existingProduct.id
                    },
                    data: {
                        quantity: existingProduct.quantity - 1
                    }
                })
                res.json(updatedProduct)
            }
            else {
                const deletedProduct = await prisma.houseProduct.delete({
                    where: {
                        id: existingProduct.id
                    }
                })
                res.json(deletedProduct)
            }
        }
        else {
            res.json({error: "El producto no existe en la casa"})
        }
    })

    router.get('/products/:houseId', async (req, res) => {
        const { houseId } = req.params
        const dueno = await prisma.houseProduct.findMany({
          where: {
            houseId: parseInt(houseId)
          }
        })
        res.json(dueno)
      })    

    router.post('/updateMinimum', async (req, res) => {
        const { houseId, productId, minimum } = req.body
        const existingProduct = await prisma.houseProduct.findFirst({
            where: {
                houseId,
                productId
            }
        })
        if (existingProduct) {
            const updatedProduct = await prisma.houseProduct.update({
                where: {
                    id: existingProduct.id
                },
                data: {
                    minimum: minimum
                }
            })
            res.json(updatedProduct)
        }
        else {
            res.json({error: "El producto no existe en la casa"})
        }
    })

    return router
}

export default houseProductRoutes