const db = require('../db');
const express = require('express');
const app = express.Router();
 
app.get('/', async(req, res, next) => {
    try{
        const albums = await db.models.Album.findAll({
            include: [
                db.models.Band
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

app.get('/:id', async(req, res, next) => {
    try{
        const album = await db.models.Album.findByPk(req.params.id);
        const band = await db.models.Band.findOne({where: {id: album.bandId}})
        const songs = await db.models.Song.findAll( {where: {albumId: album.id, bandId: band.id}, order: ['number'] });
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

module.exports = app;