import { type PrismaClient } from "@prisma/client"
import { type Express } from "express"
import { validatePassword, validationEmail } from "../validationMiddleware";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

const userRoutes = (prisma: PrismaClient) => {
    const router = require('express').Router()

    //validate-token and return user
    router.post('/validatetoken', async (req, res) => {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) {
            return res.status(401).json({ error: 'Token not found' })
        }
        try {
            const payload = jwt.verify(token, SECRET_KEY)
            const user = await prisma.user.findUnique({
                where: {
                    id: payload.userId
                },
                include: {
                    ownedHouse: true
                }
            })
            if (!user) {
                return res.status(401).json({ error: 'User not found' })
            }
            res.json(user)
        } catch (error) {
            console.error(error)
                    res.status(401).json({ error: 'Invalid token' })
        }
    })

    //agregar usuario
    /*router.post('/signup', async (req, res) => {
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
    })*/
    
    // Registrar usuario
    router.post("/signup", validationEmail, validatePassword,async (req, res) => {
        const { name, surname, email, password } = req.body;

        const lowedEmail = email.toLowerCase();

        try {
            // Hashear contraseña
            const hashedPassword = await bcrypt.hash(password, 10);

            //primero creo una casa vacía
            const newHouse = await prisma.house.create({
                data: {
                    name: `${name}'s house`
                }
            })

            const newUser = await prisma.user.create({
                data: {
                    name,
                    surname,
                    email: lowedEmail,
                    password: hashedPassword,
                    houseId: newHouse.id,
                    ownedHouse: {
                        connect: {
                            id: newHouse.id
                        }
                    }
                },
            });

            res.status(201).json(newUser);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al registrar el usuario" });
        }
    });
        
    /*router.post('/login', async (req, res) => {
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
    })*/
    // Iniciar sesión
    router.post("/login", async (req, res) => {
        const { email, password } = req.body;

        const lowedEmail = email.toLowerCase();

        try {
            const user = await prisma.user.findUnique({
                where: { email: lowedEmail },
                include: { ownedHouse: true },
            });

            if (!user) {
                return res.status(401).json({ error: "Credenciales inválidas" });
            }

            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
                return res.status(401).json({ error: "Credenciales inválidas" });
            }

            const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "7d" });

            res.json({
                token,
                user: user,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al iniciar sesión" });
        }
    });

    //Refresh user data
    router.post('/', async (req, res) => {
        const { id } = req.body
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(id)
            },
            include: {
                ownedHouse: true
            }
        })
        if (user) {
            res.json(user)
        } else {
            res.status(404).json({ error: 'User not found' })
        }
    })

   // Actualizar información de usuario
   router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { name, surname, email} = req.body;

    const lowedEmail = email.toLowerCase();

    try {
        const updatedUser = await prisma.user.update({
            where: {
                id: parseInt(id),
            },
            include: {
                ownedHouse: true
            },
            data: {
                name,
                surname,
                email: lowedEmail,
            },
        });

        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar el usuario" });
    }
    });

    //change password only, validate old password
    router.put('/changepassword/:id', validatePassword, async (req, res) => {
        const { id } = req.params
        const { oldPassword, password } = req.body
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(id)
            }
        })
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }
        console.log(user)
        const isValidPassword = await bcrypt.compare(oldPassword, user.password)
        if (!isValidPassword) {
            console.log('Old password incorrect')
            return res.status(400).send(
                { errors: [{ 
                    field: "password",
                    message: "Old password incorrect."
                 }] 
            });
        }
        console.log(isValidPassword)
        const hashedPassword = await bcrypt.hash(password, 10)
        const updatedUser = await prisma.user.update({
            where: {
                id: parseInt(id)
            },
            data: {
                password: hashedPassword
            }
        })
        res.json(updatedUser)
    })
    

    return router
}

export default userRoutes