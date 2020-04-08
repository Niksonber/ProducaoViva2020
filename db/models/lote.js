module.exports = (sequelize, DataTypes) => {

  // Declaração da tabela
  var Lote = sequelize.define('Lote', {
    data: DataTypes.DATE,
    qtd_faceshields: DataTypes.INTEGER
  }, {timestamps: false, freezeTableName: true});

  return Lote;
}