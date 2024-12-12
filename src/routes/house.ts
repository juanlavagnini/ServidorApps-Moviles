import { type PrismaClient } from "@prisma/client"
import { type Express } from "express"

const houseRoutes = (prisma: PrismaClient) => {
    const router = require('express').Router()
    //Join house with user
    router.post('/join', async (req, res) => {
        const {ownerEmail, userId, delegatedOwner} = req.body
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
            },
            include: {
                ownedHouse: true
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
        //Si me mandan un delegado, cambio la casa al delegado
        //Si no pregunto si hay mas miembros, si no hay mas elimino la casa
        if (delegatedOwner!='') {
            const delegated = await prisma.user.findUnique({
                where: {
                    id: delegatedOwner
                }
            })
            console.log(delegated)
            if (!delegated) {
                return res.status(404).json({ error: 'Delegated not found' })
            }
            const updateDelegated = await prisma.house.update({
                where: {
                    id: owner.houseId
                },
                data: {
                    ownerId: delegated.id
                }
            })
        }
        else{
            if (guest.ownedHouse) {
            const deleteHouse = await prisma.house.delete({
                where: {
                    ownerId: guest.id
                }
            })
            }
        }

        const updatedUser = await prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                ownedHouse: true
            }
        })
        res.json(updatedUser)
    })

    //leave house : create a new house for the user where he is the owner and update the user houseId
    router.post('/leave', async (req, res) => {
        const {userId, delegatedUserId} = req.body
        console.log(userId)
        console.log(delegatedUserId)
        const user = await prisma.user.findUnique({
            where: {
                id: Number(userId)
            },
            include: {
                ownedHouse: true
            }
        })
        if (user){
            const oldHouse = await prisma.house.findUnique({
                where: {
                    id: user.houseId
                }
            })
            if (delegatedUserId!='' && user.ownedHouse) {
                const delegated = await prisma.user.findUnique({
                    where: {
                        id: Number(delegatedUserId)
                    }
                })
                console.log(delegated)
                if (!delegated) {
                    return res.status(404).json({ error: 'Delegated not found' })
                }
                const updateDelegated = await prisma.house.update({
                    where: {
                        id: oldHouse?.id
                    },
                    data: {
                        ownerId: delegated.id
                    }
                })
                console.log(updateDelegated)
                const newHouse = await prisma.house.create({
                    data: {
                        name: `${user.name}'s house`
                    }
                })
                console.log(newHouse)
        
                const update = await prisma.user.update({
                    where: {
                        id: userId
                    },
                    data: {
                        houseId: newHouse.id,
                        ownedHouse: {
                            connect: {
                                id: newHouse.id
                            }
                        }
                    }
                })
            }
            else{
                const originalHouse = user.houseId;

                const newHouse = await prisma.house.create({
                    data: {
                        name: `${user.name}'s house`
                    }
                })
                console.log(newHouse)
        
                const update = await prisma.user.update({
                    where: {
                        id: userId
                    },
                    data: {
                        houseId: newHouse.id,
                        ownedHouse: {
                            connect: {
                                id: newHouse.id
                            }
                        }
                    }
                })

                if (user.ownedHouse) {
                    const deleteHouse = await prisma.house.delete({
                        where: {
                            id: originalHouse
                        }
                    })
                }
            }
        }
        const updatedUser = await prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                ownedHouse: true
            }
        })
        res.json(updatedUser)

    })

    //get members of a house by owner id
    router.post('/members', async (req, res) => {
        const {ownerId} = req.body
        console.log(ownerId) 
        const house = await prisma.house.findUnique({
            where: {
                ownerId: Number(ownerId)
            }
        })
        console.log(house)
        if (house) {
            console.log('house found')
            const members = await prisma.user.findMany({
                where: {
                    houseId: house.id
                },
                select: {
                    id: true,
                    name: true,
                    surname: true,
                }
            })
            //eliminar al propio owner
            const membersNotOwners = members.filter(member => member.id != ownerId)
            console.log(membersNotOwners)
            res.json(membersNotOwners)
        }
        else{
            res.status(404).json({ error: 'House not found' })
        }
    })

    //Remove a member from a house
    router.post('/removeMember', async (req, res) => {
        const {removedUserId} = req.body
        console.log("Llego")
        console.log(removedUserId)
        const user = await prisma.user.findUnique({
            where: {
                id: Number(removedUserId)
            }
        })
        if (user) {
            const newHouse = await prisma.house.create({
                data: {
                    name: `${user.name}'s house`
                }
            })
            console.log(newHouse)
            const updatedUser = await prisma.user.update({
                where: {
                    id: Number(removedUserId)
                },
                data: {
                    houseId: newHouse.id,
                    ownedHouse: {
                        connect: {
                            id: newHouse.id
                        }
                    }
                }
            })
            res.json(updatedUser)
        }
        else{
            res.status(404).json({ error: 'User not found' })
        }
    })

    return router
}

export default houseRoutes