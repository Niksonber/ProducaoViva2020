module.exports = (sequelize, DataTypes) => {

  // Declaração da tabela
  var EntidadeExterna = sequelize.define('EntidadeExterna', {
    nome: DataTypes.STRING,
    email: DataTypes.STRING,
    nomeRepresentante: DataTypes.STRING,
    telefone: DataTypes.STRING
  }, {timestamps: false, freezeTableName: true});

  return EntidadeExterna;
}