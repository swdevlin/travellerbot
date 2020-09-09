const fs = require('fs');

const starports = JSON.parse(fs.readFileSync('data/starport.json', 'utf8'));

const planetSizes = JSON.parse(fs.readFileSync('data/planet_size.json', 'utf8'));

const governments = JSON.parse(fs.readFileSync('data/government.json', 'utf8'));

const atmospheres = JSON.parse(fs.readFileSync('data/atmosphere.json', 'utf8'));

const hydrospheres = JSON.parse(fs.readFileSync('data/hydrographic.json', 'utf8'));

const lawLevels = JSON.parse(fs.readFileSync('data/law_level.json', 'utf8'));

const techLevels = JSON.parse(fs.readFileSync('data/tech_level.json', 'utf8'));

module.exports.starports = starports;
module.exports.planetSizes = planetSizes;
module.exports.governments = governments;
module.exports.atmospheres = atmospheres;
module.exports.hydrospheres = hydrospheres;
module.exports.lawLevels = lawLevels;
module.exports.techLevels = techLevels;
