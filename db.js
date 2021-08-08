const Sequelize = require('sequelize');
const { STRING } = Sequelize;
const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/music_directory_db');

//band can have many albums
//album can have one band
//album can have many songs
//song can have one album and one band
  
const Band = db.define('band', {
    name: {
        type: STRING,
        allowNull: false,
        unique: true
    }
});

const Album = db.define('album', {
    name: {
        type: STRING,
        allowNull: false,
        unique: true
    },
    imageUrl: {
        type: STRING
    }
});

const Song = db.define('song', {
    name: {
        type: STRING,
        allowNull: false
    }
});

Song.belongsTo(Band);
Song.belongsTo(Album);
Album.belongsTo(Band);
Band.hasMany(Album);

const syncAndSeed = async() => {
    await db.sync({ force: true }); //dropping tables if they exist

    const [dirtyProjectors, caetanoVeloso] = await Promise.all(['Dirty Projectors', 'Caetano Veloso'].map(name => Band.create({name})));
    
    const [bitteOrca, tropicalia2, liveAtCH, lampLit] = await Promise.all(['Bitte Orca', 'Tropicalia 2', 'Live at Carnegie Hall', 'Lamp Lit Prose'].map((name) => Album.create({name})));
    
    bitteOrca.imageUrl ='https://upload.wikimedia.org/wikipedia/en/6/69/DirtyProjectors-BitteOrca.jpg';
    tropicalia2.imageUrl='https://upload.wikimedia.org/wikipedia/en/7/72/Caetano_Veloso_e_Gilberto_Gil_%E2%80%93_Tropic%C3%A1lia_2.png';
    liveAtCH.imageUrl='https://upload.wikimedia.org/wikipedia/en/d/d8/David_Byrne_and_Caetano_Veloso_-_Live_at_Carnegie_Hall.jpg';
    lampLit.imageUrl='https://upload.wikimedia.org/wikipedia/en/a/a2/Dirty_Projectors_-_Lamp_Lit_Prose.jpg';
    
    lampLit.bandId = dirtyProjectors.id;
    bitteOrca.bandId = dirtyProjectors.id;
    liveAtCH.bandId = caetanoVeloso.id;
    tropicalia2.bandId = caetanoVeloso.id;
    
    await Promise.all([bitteOrca.save(), tropicalia2.save(), liveAtCH.save(), lampLit.save()]);
    
    const [cannibalresource, temeculasunrise, thebride] = await Promise.all(['Cannibal Resource', 'Temecula Sunrise', 'The Bride'].map((name) => Song.create({name, albumId: bitteOrca.id, bandId: dirtyProjectors.id})));
    const [haiti, cinemanovo, nossagente] = await Promise.all(['Haiti', 'Cinema novo', 'Nossa gente'].map((name) => Song.create({name, albumId: tropicalia2.id, bandId: caetanoVeloso.id})));
    const [desdeque, voceelinda, sampa] = await Promise.all(['Desde Que o Samba e Samba', 'Voce e Linda', 'Sampa'].map((name) => Song.create({name, albumId: liveAtCH.id, bandId: caetanoVeloso.id})));
    const [rightnow, breakthru, thatsalifestyle] = await Promise.all(['Right Now', 'Break-Thru', 'Thats a Lifestyle'].map((name) => Song.create({name, albumId: lampLit.id, bandId: dirtyProjectors.id})));
}


module.exports = {
    syncAndSeed,
    models: {
      Band,
      Album,
      Song
    }
};