import { type PrismaClient } from "@prisma/client"
import { type Express } from "express"
import userRoutes from "./user"
import houseProductRoutes from "./houseProduct"
import houseRoutes from "./house"

const addRoutes = (app: Express, prisma: PrismaClient) => {
    app.get('/', (req, res) => {
        res.send( "Hello world!")
    })

  
    // Acá van tus custom routers
    app.use('/user/', userRoutes(prisma))
    app.use('/houseProduct/', houseProductRoutes(prisma))
    app.use('/house/', houseRoutes(prisma))
}

export default addRoutes