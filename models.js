const { Schema, model, Types } = require('mongoose')

const Food = model('pos-foods', new Schema({
    name: String,
    price: Number,
    image: String,
    category: {
        type: Types.ObjectId,
        ref: 'pos-categories'
    }
}, {
    timestamps: true,
}))

const Category = model('pos-categories', new Schema({
    name: String,
    icon: String,
}, {
    timestamps: true,
}))

const Order = model('pos-orders', new Schema({
    name: String,
    orderId: Number,
    total: Number,
    archive: {
        type: Boolean,
        default: false
    },
    completed: {
        type: Boolean,
        default: false
    },
    foods: [{
        food: {
            type: Types.ObjectId,
            ref: 'pos-foods'
        },
        quantity: Number
    }]
}, {
    timestamps: true,
}))

const Statistic = model('pos-statistics', new Schema({
    price: Number,
    name: String,
    day: String,
    type: {
        type: String,
        enum: ['food', 'order'],
        default: 'food'
    },
    quantity: Number
}, {
    timestamps: true,
}))

const Counter = model('pos-counter', new Schema({
    type: { type: String, required: true },
    value: { type: Number, default: 0 }
}))

module.exports = {
    Food,
    Category,
    Order,
    Counter,
    Statistic
}