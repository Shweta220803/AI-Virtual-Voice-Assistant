import express from "express"
import 'dotenv/config'
import cors from 'cors'
import connectDB from "./config/db.js"
import cookieParser from "cookie-parser"
import authRouter from "./routes/authRoute.js"
import userRouter from "./routes/userRoute.js"
const app = express()



// Connect to database
connectDB()

// middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))


app.get('/', (req, res) => {
    res.send('API is Working')
})
//  Routes
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)

const PORT=process.env.PORT || 8001
app.listen(PORT, () =>{
    console.log(`Server is running at PORT ${PORT}`);
    
})