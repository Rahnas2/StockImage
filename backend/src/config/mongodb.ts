import mongoose from "mongoose"
const connectDB = async () => {
    try {
        const mongoUrI = process.env.MONGO_URI as string
        console.log('mongouri ', mongoUrI)
        await mongoose.connect(mongoUrI)
        console.log('mongo db connected successfully')
    } catch (error) {
        console.error('mongodb connection error ', error)
    } 
}

export default connectDB   