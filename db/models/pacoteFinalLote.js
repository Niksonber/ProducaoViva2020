module.exports = (sequelize, DataTypes) => {

  // Declaração da tabela
  var PacoteFinalLote = sequelize.define('PacoteFinalLote', {
  }, {timestamps: false, freezeTableName: true});

  // Relacionamento dessa entidade com outras
  PacoteFinalLote.associate = (models) => {
    PacoteFinalLote.belongsTo(models.Lote); // <- Cria chave estrangeira LoteId nessa tabela
    PacoteFinalLote.belongsTo(models.PacoteFinal); // <- Cria chave estrangeira PacoteFinalId nessa tabela
  }

  return PacoteFinalLote;
}