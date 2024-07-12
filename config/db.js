const mongoose = require('mongoose')

const connectDB = async()=>{
    await mongoose.connect(`mongodb+srv://Sreyaa:tJ44ZDxwrWeMtbca@cluster0.9ls1twp.mongodb.net/mydb`)
    console.log(`Successfully Connected ${mongoose.connection.host}`)
}

module.exports  =  connectDB; 
 