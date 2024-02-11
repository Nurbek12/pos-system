const { Router } = require('express')
const { upload } = require('./upload')
const { Category, Food, Order, Statistic, Counter } = require('./models')

async function addStatistics(type, price, name, quantity) {
    try {
        const day = new Date().toLocaleDateString();
        const filter = { day, type }
        type === 'food' && (filter.name = name) 
        const update = { $inc: { quantity, price } };
        const options = { upsert: true }
        
        await Statistic.findOneAndUpdate(filter, update, options);
    } catch (error) {
        console.error(error);
        throw new Error('Ошибка при обновлении статистики');
    }
}

module.exports = {
    orders: Router()
        .get('/', async (req, res) => {
            try {
                const page = req.query?.page || 1
                const limit = req.query?.limit || 200

                const all = { archive: false }
                if(req.query?.all) Object.assign(all, { archive: true })
                const [total, result] = await Promise.all([
                    Order.countDocuments(all),
                    Order.find(all)
                        .sort({ createdAt: 'desc' })
                        .skip((page - 1) * limit)
                        .limit(+limit)
                        .populate('foods.food', 'name price image'),
                    ])
                res.json({result, total})
            } catch (error) {
                console.log(error)
            }
        })
        .get('/count', async (req, res) => {
            try {
                let count;
                const c = await Counter.findOne({ type: 'orderId' })
                if(!c){
                    await Counter.create({ type: "orderId" })
                    count = 0
                }else{
                    count = c.value
                }
                res.json(count)
            } catch (error) {
                console.log(error)
            }
        })
        .post('/', async (req, res) => {
            try {
                const doc = await Counter.findOneAndUpdate({ type: 'orderId' }, { $inc: { value: 1 } }, { new: true, upsert: true })
                req.body.orderId = doc.value
                const order = await Order.create(req.body)
                const result = await order.populate('foods.food', 'name image price')
                addStatistics('order', req.body.total, req.body.name, 1)
                res.json(result)
            } catch (error) {
                console.log(error);
            }
        })
        .put('/complete/:id', async (req, res) => {
            try {
                await Order.findByIdAndUpdate(req.params.id, { $set: { completed: true } })
                res.json(true)
            } catch (error) {
                console.log(error)
            }
        })
        .put('/archive/:id', async (req, res) => {
            try {
                const result = await Order.findByIdAndUpdate(req.params.id, { $set: { archive: true, foods: [] } })
                    .populate('foods.food', 'name price')
                
                res.json(true)
                result.foods.map(f => addStatistics('food', f.food.price * f.quantity, f.food.name, f.quantity))
            } catch (error) {
                console.log(error)
            }
        }),
    foods: Router()
        .get('/', async (req, res) => {
            try {
                const result = await Food.find()
                    .populate('category', 'name')
                res.json(result)
            } catch (error) {
                console.log(error)
            }
        }) 
        .get('/menu-list', async (req, res) => {
            try {
                const result = await Food.aggregate([
                    {
                        $lookup: {
                            from: 'pos-categories',
                            foreignField: '_id',
                            localField: 'category',
                            as: 'category',
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            category: {$arrayElemAt:["$category", 0]},
                            name: 1,
                            price: 1,
                            image: 1,
                        }
                    },
                    {
                        $group: {
                            _id: "$category",
                            foods: { $push: "$$ROOT" }
                        }
                    }
                ])
            res.json(result)
            } catch (error) {
                console.log(error)
            }
        })
        .post('/', upload.single('file'), async (req, res) => {
            try {
                if(req.file) req.body.image = req.file.filename
                const result = await Food.create(req.body)
                res.json(result)
            } catch (error) {
                console.log(error)
            }
        })
        .put('/:id', upload.single('file'), async (req, res) => {
            try {
                if(req.file) req.body.image = req.file.filename
                const result = await Food.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
                res.json(result)
            } catch (error) {
                console.log(error)
            }
        })
        .delete('/:id', async (req, res) => {
            try {
                await Food.findByIdAndDelete(req.params.id)
                res.json(true)
            } catch (error) {
                console.log(error)
            }
        }),
    category: Router()
        .get('/', async (req, res) => {
            try {
                const result = await Category.find()
                res.json(result)
            } catch (error) {
                console.log(error)
            }
        })
        .post('/', upload.single('file'), async (req, res) => {
            try {
                if(req.file) req.body.icon = req.file.filename
                const result = await Category.create(req.body)
                res.json(result)
            } catch (error) {
                console.log(error)
            }
        })
        .put('/:id', upload.single('file'), async (req, res) => {
            try {
                if(req.file) req.body.icon = req.file.filename
                const result = await Category.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
                res.json(result)
            } catch (error) {
                console.log(error)
            }
        })
        .delete('/:id', async (req, res) => {
            try {
                await Category.findByIdAndDelete(req.params.id)
                res.json(true)
            } catch (error) {
                console.log(error)
            }
        }),
    statistic: Router()
        .get('/', async (req, res) => {
            try {
                let $match = {}
                if(req.query.day) $match = { day: req.query.day }
                if(req.query.start && req.query.end) $match = {
                    day: {
                        $gte: req.query.start,
                        $lt: req.query.end,
                    }
                }
                const result = await Statistic.aggregate([
                    {
                        $match
                    },
                    {
                        $group: {
                            _id: '$type',
                            data: { $push: "$$ROOT" }
                        }
                    }
                ])
                res.json(result)
            } catch (error) {
                console.log(error)
            }
        })
}