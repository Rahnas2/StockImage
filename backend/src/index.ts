import express from 'express'

import dotenv from 'dotenv'
dotenv.config()

import cors from 'cors'

import cookieParser  from 'cookie-parser'

import connectDB from './config/mongodb'

import authRoutes from './routes/auth.routes'
import uploadRoutes from './routes/upload.routes'

import { errorHandler } from './middleware/error.middleware'

const PORT = process.env.PORT || 3030      
console.log('port ', PORT)
  
const app = express()

app.use(cors({
    origin: process.env.CLIENT_URI,
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/uploads', uploadRoutes)


app.use(errorHandler)

connectDB().then(() => {
    app.listen(PORT, () => {
    console.log(`server is runnig on port ${PORT}`)       
})
})