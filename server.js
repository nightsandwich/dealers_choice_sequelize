const { syncAndSeed, models: {Band, Album, Song} } = require('./db');
const path = require('path');
const express = require('express');
const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => res.redirect('/bands'));
app.use('/bands', require('./routes/bands'));
app.use('/albums', require('./routes/albums'));


const init = async()=> {
    try {
        await syncAndSeed();
        const port = process.env.PORT || 3000;
        app.listen(port, ()=> console.log(`listening on port ${port}`));
    }
    catch(err){
        console.log(err);
    }
};

init();