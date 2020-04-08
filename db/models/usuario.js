module.exports = (sequelize, DataTypes) => {

  // Declaração da tabela
  var Usuario = sequelize.define('Usuario', {
    nome: DataTypes.STRING,
    email: DataTypes.STRING,
    telefone: DataTypes.STRING
  }, {timestamps: false, freezeTableName: true});

  return Usuario;
}