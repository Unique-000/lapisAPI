const express = require('express');
const app = express();


//routes


app.get('/', (req, res) => {
    res.send('Wassap')

})



app.listen(3000, () => console.log('Server Started!!'));