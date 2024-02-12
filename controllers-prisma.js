const { Router } = require('express')
const { upload } = require('./upload')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient({})

function count_by_days(data) {
    const counts = {} // Initialize an array with 8 zeros
    let k
    data.map((c) => {
        if(k == c.created_at.toLocaleDateString()) {
            counts[k] += 1
        }else{
            k = c.created_at.toLocaleDateString()
            counts[k] = 1
        }
    })
    return counts
}

function count_foods(data) {
    const counts = {}
    let k
    data.map((c) => {
        if(k == c.food.name) {
            counts[k] += c.quantity
        }else{
            k = c.food.name
            counts[k] = c.quantity
        }
    })
    return counts
}

module.exports = {
    orders: Router()
        .get('/', async (req, res) => {
            try {
                const page = req.query?.page || 1
                const limit = req.query?.limit || 200

                const [total,result] = await prisma.$transaction([
                    prisma.order.count({ where: { archive: !!req.query?.all } }),
                    prisma.order.findMany({ 
                        where: { archive: !!req.query?.all },
                        orderBy: {
                            created_at: 'desc'
                        },
                        skip: (page - 1) * limit,
                        take: +limit,
                        include: !!req.query?.all ? {} : {
                            order_items: {
                                include: {
                                    food: {
                                        select: {
                                            id: true,
                                            name: true,
                                            image: true,
                                            price: true,

                                        }
                                    }
                                }
                            }
                        }
                    }),
                ])

                res.json({result, total})
            } catch (error) {
                console.log(error)
            }
        })
        .post('/', async (req, res) => {
            try {
                const { items, ...data } = req.body
                const result = await prisma.order.create({ data })
                const order_items = await Promise.all(items.map(async (item) => {
                    return await prisma.orderItem.create({
                        data: {
                            food_id: item.food,
                            quantity: item.quantity,
                            order_id: result.id
                        },
                        include: {
                            food: {
                                select: {
                                    id: true,
                                    image: true,
                                    name: true,
                                    price: true,
                                }
                            }
                        }
                    })
                }))
                res.json({ ...result, order_items })
            } catch (error) {
                console.log(error);
            }
        })
        .put('/complete/:id', async (req, res) => {
            try {
                await prisma.order.update({ where: { id: +req.params.id }, data: { completed: true } })
                res.json(true)
            } catch (error) {
                console.log(error)
            }
        })
        .put('/archive/:id', async (req, res) => {
            try {
                await prisma.order.update({ where: { id: +req.params.id }, data: { archive: true } })
                
                res.json(true)
            } catch (error) {
                console.log(error)
            }
        }),
    foods: Router()
        .get('/', async (req, res) => {
            try {
                const result = await prisma.food.findMany({
                    include: {
                        category: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    }
                })
                res.json(result)
            } catch (error) {
                console.log(error)
            }
        }) 
        .get('/menu-list', async (req, res) => {
            try {
                const result = await prisma.category.findMany({
                    include: {
                        foods: {
                            select: {
                                id: true,
                                image: true,
                                name: true,
                                price: true,
                            }
                        }
                    }
                })
                res.json(result)
            } catch (error) {
                console.log(error)
            }
        })
        .post('/', upload.single('file'), async (req, res) => {
            try {
                if(req.file) req.body.image = req.file.filename
                req.body.category_id = +req.body.category_id
                req.body.price = +req.body.price
                if(req.body.id) delete req.body.id
                const result = await prisma.food.create({
                    data: req.body,
                    include: {
                        category: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                })
                res.json(result)
            } catch (error) {
                console.log(error)
            }
        })
        .put('/:id', upload.single('file'), async (req, res) => {
            try {
                if(req.file) req.body.image = req.file.filename
                req.body.category_id = +req.body.category_id
                req.body.price = +req.body.price
                const result = await prisma.food.update({ where: { id: +req.params.id }, data: req.body})
                res.json(result)
            } catch (error) {
                console.log(error)
            }
        })
        .delete('/:id', async (req, res) => {
            try {
                await prisma.food.delete({ where: { id: +req.params.id } })
                res.json(true)
            } catch (error) {
                console.log(error)
            }
        }),
    category: Router()
        .get('/', async (req, res) => {
            try {
                const result = await prisma.category.findMany()
                res.json(result)
            } catch (error) {
                console.log(error)
            }
        })
        .post('/', upload.single('file'), async (req, res) => {
            try {
                if(req.file) req.body.image = req.file.filename
                const result = await prisma.category.create({ data: req.body })
                res.json(result)
            } catch (error) {
                console.log(error)
            }
        })
        .put('/:id', upload.single('file'), async (req, res) => {
            try {
                if(req.file) req.body.image = req.file.filename
                const result = await prisma.category.update({ where: { id: +req.params.id }, data: req.body })
                res.json(result)
            } catch (error) {
                console.log(error)
            }
        })
        .delete('/:id', async (req, res) => {
            try {
                await prisma.category.delete({ where: { id: +req.params.id } })
                res.json(true)
            } catch (error) {
                console.log(error)
            }
        }),
    statistic: Router()
        .get('/', async (req, res) => {
            try {
                const where = { created_at: {} }
                if(req.query.gt) where.created_at.gte = new Date(req.query.gt)
                if(req.query.lt) where.created_at.lt = new Date(req.query.lt)
                const result = await prisma.order.findMany({
                    where
                })
                res.json(count_by_days(result))
            } catch (error) {
                console.log(error)
            }
        })
        .get('/foods', async (req, res) => {
            try {
                const where = { created_at: {} }
                if(req.query.gt) where.created_at.gte = new Date(req.query.gt)
                if(req.query.lt) where.created_at.lt = new Date(req.query.lt)
                
                const result = await prisma.orderItem.findMany({
                    where,
                    include: {
                        food: {
                            select: {
                                id: true,
                                name: true,       
                            }
                        }
                    }
                })
                res.json(count_foods(result))
            } catch (error) {
                console.log(error)
            }
        })
}