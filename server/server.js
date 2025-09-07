import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import  connection  from './config/db.js';
import clerkWebhooks from './controllers/webhooks.js';
dotenv.config();
// import connection from './config/db.js';



 const app = express();
// connect to database
await connection()


// middleware
    app.use(cors());
    app.use(express.json());

    app.get('/', (req, res) => res.send('API Running'));


    // routes

    app.use('/webhooks',clerkWebhooks );
    const PORT = process.env.PORT || 5000;
    app.listen(PORT,  () => {
        console.log(`Server started on port ${PORT}`);
    })
        
