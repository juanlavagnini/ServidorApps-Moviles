import { type PrismaClient } from "@prisma/client"
import { type Express } from "express"

const userRoutes = (prisma: PrismaClient) => {
    const router = require('express').Router()
    router.get('/', async (req, res) => {
        const users = await prisma.user.findMany()
        res.json(users)
    })

    //agregar usuario
    router.post('/signup', async (req, res) => {
        console.log(req.body)
        const { name, surname, email, password } = req.body
        const newUser = await prisma.user.create({
            data: {
                name,
                surname,
                email,
                password
            }
        })
        res.json(newUser)
    })

    //login
    router.post('/login', async (req, res) => {
        const { email, password } = req.body
        const user = await prisma.user.findFirst({
            where: {
                email,
                password
            },
            include: {
                ownedHouse: true
            }
        })
        if (user) {
            res.json(user)
            console.log('Usuario logueado')
        } else {
            res.status(401).json({ error: 'Invalid credentials' })
            console.log('Usuario no logueado')
        }
    })

    //update user info
    router.put('/:id', async (req, res) => {
        const { id } = req.params
        const { name, surname, email, password } = req.body
        const updatedUser = await prisma.user.update({
            where: {
                id: parseInt(id)
            },
            data: {
                name,
                surname,
                email,
                password
            }
        })
        res.json(updatedUser)
        console.log('Usuario actualizado')
    })

    return router
}

export default userRoutes