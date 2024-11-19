import { type PrismaClient } from "@prisma/client"
import { type Express } from "express"
import { validatePassword, validationEmail } from "../validationMiddleware";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

const userRoutes = (prisma: PrismaClient) => {
    const router = require('express').Router()
    router.get('/', async (req, res) => {
        const users = await prisma.user.findMany()
        res.json(users)
    })

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

        try {
            // Hashear contraseña
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await prisma.user.create({
                data: {
                    name,
                    surname,
                    email,
                    password: hashedPassword,
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

        try {
            const user = await prisma.user.findUnique({
                where: { email },
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
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    surname: user.surname,
                    ownedHouse: user.ownedHouse,
                },
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al iniciar sesión" });
        }
    });

    /*router.put('/:id', async (req, res) => {
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
    })*/
   // Actualizar información de usuario
   router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { name, surname, email, password } = req.body;

    try {
        const hashedPassword = password
            ? await bcrypt.hash(password, 10)
            : undefined;

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
                email,
                ...(hashedPassword && { password: hashedPassword }),
            },
        });

        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar el usuario" });
    }
    });

    return router
}

export default userRoutes