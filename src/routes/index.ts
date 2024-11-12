import { type PrismaClient } from "@prisma/client"
import { type Express } from "express"
import userRoutes from "./user"
import houseProductRoutes from "./houseProduct"
//import mascotasRoutes from "./mascotas"

const addRoutes = (app: Express, prisma: PrismaClient) => {
    app.get('/', (req, res) => {
        res.send( "Hello world!")
    })

  
    // Acá van tus custom routers
    app.use('/user/', userRoutes(prisma))
    //app.use('/mascotas/', mascotasRoutes(prisma))
    app.use('/houseProduct/', houseProductRoutes(prisma))
}

export default addRoutes