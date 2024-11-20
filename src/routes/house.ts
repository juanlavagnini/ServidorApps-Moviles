import { type PrismaClient } from "@prisma/client"
import { type Express } from "express"

const houseRoutes = (prisma: PrismaClient) => {
    const router = require('express').Router()
    //Join house with user
    router.post('/join', async (req, res) => {
        const {ownerEmail, userId} = req.body
        const owner = await prisma.user.findUnique({
            where: {
                email: ownerEmail
            }
        })
        console.log(owner)
        if (!owner) {
            return res.status(404).json({ error: 'House not found' })
        }
        const guest = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })
        console.log(guest)
        if (!guest) {
            return res.status(404).json({ error: 'User not found' })
        }
        const update = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                houseId: owner.houseId,
                ownedHouse: undefined
            }
        })
        console.log(update)
        //delete old house
        const deleteHouse = await prisma.house.delete({
            where: {
                ownerId: guest.id
            }
        })
        console.log(deleteHouse)

        res.json(update)
    })

    return router
}

export default houseRoutes