import io from 'socket.io-client'
// import { baseURL } from '.'

const socket = io('/')

export const create_food = (data) => socket.emit('create-food', data)

export const complete_food = (index) => socket.emit('complete-food', index)

export const delete_food = (index) => socket.emit('delete-food', index)


export const food_created = (cb) => socket.on('food-created', cb)

export const food_completed = (cb) => socket.on('food-completed', cb)

export const food_deleted = (cb) => socket.on('food-deleted', cb)