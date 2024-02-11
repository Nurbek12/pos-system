const multer = require('multer')
const path = require('path')
const uuid = require('uuid').v4

module.exports = {
    upload: multer({
        storage: multer.diskStorage({
            filename: (_,file,cb) => cb(null, uuid()+path.extname(file.originalname)),
            destination: (_,__,cb) => cb(null, path.join(__dirname,'upload'))
        })
    })
}