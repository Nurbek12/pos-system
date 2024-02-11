const path = require('path')
// const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const { Server } = require('socket.io')
const { createServer } = require('http')
const { category, foods, orders, statistic } = require('./controllers')

dotenv.config()

const app = express()
const server = createServer(app)
const io = new Server(server, { cors: {origin:"*", credentials: true} })
const db = async () => mongoose.connect(process.env.MONGO_URI).then(()=>console.log('db connect...')).catch((er) => console.log(er))

io.on('connection', socket => {
    socket.on('create-food', (data) => {
        io.emit('food-created', data)
    })
    socket.on('complete-food', (data, index) => {
        io.emit('food-completed', data, index)
    })
    socket.on('delete-food', (data) => {
        io.emit('food-deleted', data)
    })
})

// app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/file', express.static(path.join(__dirname, 'upload')))
app.use(express.static(path.join(__dirname, 'client', 'dist')))

app.use('/api/foods', foods)
app.use('/api/orders', orders)
app.use('/api/categories', category)
app.use('/api/statistics', statistic)
app.get('*', async (req, res) => res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html')))

server.listen(process.env.PORT, () => {
    db()
    console.log('server started...')
})