const { error } = require('console');
const express = require('express/');
const cors = require('cors');
require('dotenv').config();

const mongoose = require('mongoose/');
const Note = require('./models/productModel')
const app = express();
app.use(express.json())
app.use(cors());
// get 10 notes starting from the given date
app.get('/browse-notes/:date', async (req, res) => {
    try {
        const { date } = req.params;

        // Parse the date string to a Date object
        const parsedDate = new Date(date);

        if (isNaN(parsedDate.getTime())) {
            // Invalid date format
            return res.status(400).json({ message: 'Invalid date format' });
        }

        // Use the 'select' method to specify the fields you want to retrieve
        const notes = await Note.find(
            {
                createdAt: {
                    $lte: parsedDate,
                }
            },
            // Specify the fields to retrieve ('title' and 'content')
            'title content createdAt'
        ).limit(10); // Limit the result to 10 notes

        res.status(200).json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});

// get specific note by title (every title is/should be unique) 
app.get('/note/:title', async (req, res) => {
    try {
        const {title} = req.params;
        const note = await Note.find({ title: title}).exec();;
        res.status(200).json(note)
    } catch (error){
        console.log(error.massage)
        res.status(500).json({"message": error.message})
    }
})

app.post('/note', async(req, res) => {
    try {
        const note = await Note.create(req.body)
        res.status(200).json(note)
    } catch (error){
        console.log(error.massage)
        res.status(500).json({"message": error.message})
    }
})
 
mongoose.connect(process.env.MONGODB)
.then(() => {
    console.log('Connected')
    app.listen(3000, () => console.log('Server Started!!'));
})
.catch(() => {
    console.log('Error' + error)
});
