require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const meetupRoutes = require('./routes/meetupRoutes');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;


app.use(morgan('combined')); 
app.use(cors()); 
app.use(bodyParser.json()); 
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/meetups', meetupRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
