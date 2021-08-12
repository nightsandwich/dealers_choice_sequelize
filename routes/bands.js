const db = require('../db');
const express = require('express');
const app = express.Router();
 
app.get('/', async(req, res, next) => {
    try{
        const bands = await db.models.Band.findAll({order: ['name']});
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

app.get('/:id', async(req, res, next) => {
    try{
        const band = await db.models.Band.findByPk(req.params.id);
        const albums = await db.models.Album.findAll( {where: {bandId: band.id}, order: ['name'] });
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
module.exports = app;