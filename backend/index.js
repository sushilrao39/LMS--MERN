import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks } from './controllers/webhooks.js'
import educatorRouter from './routes/educatorRoutes.js'
import { clerkMiddleware } from '@clerk/express'
import connectCloudinary from './configs/cloudinary.js'
import courseRouter from './routes/courseRoutes.js'
import userRouter from './routes/userRoutes.js'
//import { ClerkExpressWithAuth } from "@clerk/express";




// Initialize Express
const app = express()

// connect to databse 
await connectDB()
await connectCloudinary()


//Middlewares
app.use(cors())
app.use(clerkMiddleware())
app.use(express.json());
//app.use(ClerkExpressWithAuth());



// Routes
app.get('/', (req, res)=> res.send("API Working "))

app.post('/clerk', express.raw({type: "application/json"}), clerkWebhooks)
app.use('/api/educator', express.json(), educatorRouter)
app.use('/api/course', express.json(), courseRouter)
app.use('/api/user', express.json(), userRouter)


// Port 
const PORT = process.env.PORT || 9000

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})
