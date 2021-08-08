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
    
    const [dpbo1, dpbo2, dpbo3, dpbo4, dpbo5, dpbo6, dpbo7, dpbo8, dpbo9] = await Promise.all(['Cannibal Resource', 'Temecula Sunrise', 'The Bride', 'Stillness is the Move', 'Two Doves', 'Useful Chamber', 'No Intention', 'Remade Horizon', 'Fluorescent Half Dome'].map((name) => Song.create({name, albumId: bitteOrca.id, bandId: dirtyProjectors.id})));
    const [cvt1, cvt2, cvt3, cvt4, cvt5, cvt6, cvt7, cvt8, cvt9, cvt10, cvt11, cvt12] = await Promise.all(['Haiti', 'Cinema novo', 'Nossa gente', 'Rap popcreto', 'Wait Until Tomorrow', 'Tradicao', 'As coisas', 'Aboio', 'Dada', 'Cada Macaco no seu galho (cho chua)', 'Baiao atemporal', 'Desde que o samba e samba'].map((name) => Song.create({name, albumId: tropicalia2.id, bandId: caetanoVeloso.id})));
    const [cvl1, cvl2, cvl3, cvl4, cvl5, cvl6, cvl7, cvl8, cvl9, cvl10, cvl11, cvl12, cvl13, cvl14, cvl15, cvl16, cvl17, cvl18] = await Promise.all(['Desde Que o Samba e Samba', 'Voce e Linda', 'Sampa', 'O Leaozinho', 'Coracao Vagabundo', 'Manhata', 'The Revolution', 'Everyones in Love With You', 'And She Was', 'She Only Sleeps', 'Life During Wartime', "God's Child", 'Road to Nowhere', 'Dreamworld: Marco de Canaveses', 'Um Canto de Afoxe para o Bloco de lle', "(Nothing But) Flowers", "Terra", "Heaven"].map((name) => Song.create({name, albumId: liveAtCH.id, bandId: caetanoVeloso.id})));
    const [rightnow, breakthru, thatsalifestyle, ifeelenergy, zombie, bluebird, founditinu, whatisthetime, youretheone, iwannafeelitall] = await Promise.all(['Right Now', 'Break-Thru', "That's a Lifestyle", 'I Feel Energy', 'Zombie Conqueror', 'Blue Bird', 'Found It In U', 'What Is the Time', "You're the One", '(I Wanna) Feel It All'].map((name) => Song.create({name, albumId: lampLit.id, bandId: dirtyProjectors.id})));
}


module.exports = {
    syncAndSeed,
    models: {
      Band,
      Album,
      Song
    }
};