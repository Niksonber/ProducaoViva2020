module.exports = (sequelize, DataTypes) => {

  // Declaração da tabela
  var Usuario = sequelize.define('Usuario', {
    nome: DataTypes.STRING
  }, {timestamps: false, freezeTableName: true});

  return Usuario;
}