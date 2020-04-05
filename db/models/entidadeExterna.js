module.exports = (sequelize, DataTypes) => {

  // Declaração da tabela
  var EntidadeExterna = sequelize.define('EntidadeExterna', {
    nome: DataTypes.STRING
  }, {timestamps: false, freezeTableName: true});

  return EntidadeExterna;
}