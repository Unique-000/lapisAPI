const mongoose = require('mongoose')

const noteSchema = mongoose.Schema({

    title :{
        type: String,
        required:[true, 'Submit the title!'] 
    },
    content :{
        type: Array,
        required:[true, 'Submit the content!'] 
    },
    views :{
        type: Number,
        required:true 
    }
    
},{
    timestamps:true
})

const Note = mongoose.model('Note', noteSchema);

module.exports = Note