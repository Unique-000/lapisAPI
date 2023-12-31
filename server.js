const { error } = require('console');
const express = require('express/');
const cors = require('cors');
require('dotenv').config();

const mongoose = require('mongoose/');
const Note = require('./models/productModel')
const app = express();
app.use(express.json())
app.use(cors());

app.get('/browse-notes/:byWhat/:value?', async (req, res) => {
    try {
      const { byWhat, value } = req.params;
  
      if (byWhat === 'date') {
        const parsedDate = value ? new Date(value) : new Date();

        console.log('Parsed Date:', parsedDate);
    
        if (isNaN(parsedDate.getTime())) {
          return res.status(400).json({ message: 'Invalid date format' });
        }
    
        const notes = await Note.find(
          {
            createdAt: {
              $lt: parsedDate,
            }
          },
          'title content createdAt'
        ).limit(10).sort({ createdAt: -1 });
    
        console.log('Notes:', notes);
        return res.status(200).json(notes || 'There are no notes matching your request!');
      
      } else if (byWhat === 'title') {
        const notes = await Note.find(
          {
            title: {
              $regex: new RegExp(value, 'i'),
            }
          },
          'title content createdAt'
        ).limit(10).sort({ createdAt: -1 });
  
        return res.status(200).json(notes || 'There are no notes matching your request!');
      } else {
        return res.status(400).json({ message: 'Invalid byWhat parameter' });
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
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
