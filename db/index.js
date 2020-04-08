const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'db/database.db'
});

// Importa os modelos
db = {};
fs.readdirSync('./db/models/').filter(x => path.extname(x) == '.js').forEach(filename => {
    var model = sequelize.import('./models/' + filename);
    db[model.name] = model;
})

// Executa as associações
Object.values(db).forEach(model => {
    console.log(model);
    if(model.associate) model.associate(db);
})

sequelize.sync();

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.DataTypes = DataTypes

module.exports = db;