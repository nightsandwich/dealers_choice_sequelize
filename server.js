const { syncAndSeed, models: {Band, Album, Song} } = require('./db');
const path = require('path');
const express = require('express');
const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => res.redirect('/bands'));

app.get('/bands', async(req, res, next) => {
    try{
        const bands = await Band.findAll();
        res.send(`
        <html>
            <head>
                <title>Bands</title>
            </head>
            <body>
                <div>
                    <h2>Bands</h2>
                    <ul style='list-style: none'>
                        ${bands.map(band => `
                        <li>
                            <a href='/bands/${band.id}'>${band.name}</a>
                        </li>
                        `).join('')}
                    </ul>
                </div>
            </body>
        </html>
    `);
    }
    catch(ex){
        next(ex);
    }
});

app.get('/bands/:id', async(req, res, next) => {
    try{
        const band = await Band.findByPk(req.params.id);
        const albums = await Album.findAll( {where: {bandId: band.id} });
        res.send(`
        <html>
            <head>
                <title>Albums</title>
            </head>
            <body>
                <div>
                    <h2>Albums by ${band.name}</h2>
                    <ul style='list-style: none'>
                        ${albums.map(album => `
                        <li>
                            ${album.name} <br>
                            <a href='/albums/${album.id}'><img src='${album.imageUrl}' width='300' border='3px solid black'></a> 
                        </li>
                        `).join('')}
                    </ul>
                </div>
            </body>
        </html>
    `);
    }
    catch(ex){
        next(ex);
    }
});

app.get('/albums', async(req, res, next) => {
    try{
        const albums = await Album.findAll({
            include: [
                Band
            ]
        });
        res.send(`
        <html>
            <head>
                <title>Albums</title>
            </head>
            <body>
                <div>
                    <h2>Albums</h2>
                    <ul style='list-style: none'>
                        ${albums.map(album => `
                        <li>
                            ${album.name} by ${album.band.name} <br>
                            <a href='/albums/${album.id}'><img src='${album.imageUrl}' width='300' border='3px solid black'></a>
                        </li>
                        `).join('')}
                    </ul>
                </div>
                <a href='/bands'>Back to Bands</a>
            </body>
        </html>
    `);
    }
    catch(ex){
        next(ex);
    }
});

app.get('/albums/:id', async(req, res, next) => {
    try{
        const album = await Album.findByPk(req.params.id);
        const band = await Band.findOne({where: {id: album.bandId}})
        const songs = await Song.findAll( {where: {albumId: album.id, bandId: band.id} });
        res.send(`
        <html>
            <head>
                <title>Track List</title>
            </head>
            <body>
                <div>
                    <h2>${album.name} by ${band.name}</h2>
                    <ol>
                        ${songs.map(song => `
                        <li>
                            ${song.name} 
                        </li>
                        `).join('')}
                    </ol>
                </div>
            </body>
        </html>
    `);
    }
    catch(ex){
        next(ex);
    }
});

const init = async()=> {
    await syncAndSeed();
    const port = process.env.PORT || 3000;
    app.listen(port, ()=> console.log(`listening on port ${port}`));
};

init();