const { syncAndSeed, models: {Band, Album, Song} } = require('./db');
const path = require('path');
const express = require('express');
const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => res.redirect('/bands'));

app.get('/bands', async(req, res, next) => {
    try{
        const bands = await Band.findAll({order: ['name']});
        res.send(`
        <html>
            <head>
                <title>Bands</title>
                <link rel="stylesheet" href="/styles.css" />
            </head>
            <body>
                <div class='nav'>
                    <a href='/bands'>ALL BANDS</a>
                    <a href='/albums'>ALL ALBUMS</a>
                </div>
                <div>
                    <h1>Bands</h1>
                    <div id='bands'>
                        ${bands.map(band => `
                        <h3>
                            <a href='/bands/${band.id}'>${band.name}</a>
                            <a href='/bands/${band.id}'><img src='${band.imageUrl}' height='300' border='3px solid black'></a>
                        </h3>
                        `).join('')}
                    </div>
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
        const albums = await Album.findAll( {where: {bandId: band.id}, order: ['name'] });
        res.send(`
        <html>
            <head>
                <title>Albums</title>
                <link rel="stylesheet" href="/styles.css" />
            </head>
            <body>
                <div class='nav'>
                    <a href='/bands'>ALL BANDS</a>
                    <a href='/albums'>ALL ALBUMS</a>
                </div>
                <div>
                    <h1>Albums by ${band.name}</h1>
                    ${albums.map(album => `
                    <div class='albums'>
                        <h3>
                            <a href='/albums/${album.id}'>${album.name}</a><br>
                            <a href='/albums/${album.id}'><img src='${album.imageUrl}' height='300' border='3px solid black'></a> 
                        </h3>
                        `).join('')}
                    </div>
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
            ],
            order: [
                'name'
            ]
        });
        res.send(`
        <html>
            <head>
                <title>Albums</title>
                <link rel="stylesheet" href="/styles.css" />
            </head>
            <body>
                <div class='nav'>
                    <a href='/bands'>ALL BANDS</a>
                    <a href='/albums'>ALL ALBUMS</a>
                </div>
                <div>
                    <h1>Albums</h1>
                    <div class='albums'>
                            ${albums.map(album => `
                            <h3>
                                <a href='/albums/${album.id}'>${album.name}</a><br><a href='/bands/${album.band.id}'> <small>(${album.band.name})</small></a> <br>
                                <a href='/albums/${album.id}'><img src='${album.imageUrl}' width='300' border='3px solid black'></a>
                            </h3>
                            `).join('')}
                    </div>
                </div>
                
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
        const songs = await Song.findAll( {where: {albumId: album.id, bandId: band.id}, order: ['number'] });
        res.send(`
        <html>
            <head>
                <title>Track List</title>
                <link rel="stylesheet" href="/styles.css" /> 
            </head>
            <body>
                <div class='nav'>
                    <a href='/bands'>ALL BANDS</a>
                    <a href='/albums'>ALL ALBUMS</a>
                </div>
                <div class='songs'>
                    <h1 style='text-align: left'>${album.name}</h1>
                    <a href='/bands/${band.id}'>(${band.name})</a>
                </div>
                    <ol>
                        ${songs.map(song => `
                        <li class='song-names'>
                            ${song.name} 
                        </li>
                        `).join('')}
                    </ol>
                
                
            </body>
        </html>
    `);
    }
    catch(ex){
        next(ex);
    }
});

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