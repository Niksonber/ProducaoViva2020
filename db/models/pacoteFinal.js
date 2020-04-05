module.exports = (sequelize, DataTypes) => {

  // Declaração da tabela
  var PacoteFinal = sequelize.define('PacoteFinal', {
  }, {timestamps: false, freezeTableName: true});

  return PacoteFinal;
}