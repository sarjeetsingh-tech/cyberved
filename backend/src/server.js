// server.js
import express from 'express';
import cors from 'cors';
import registrationRoutes from './rotues/registrationRoutes.js'

const app = express();
app.use(cors());
app.use(express.json());



app.use('/register', registrationRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));