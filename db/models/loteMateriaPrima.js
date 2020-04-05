module.exports = (sequelize, DataTypes) => {

  // Declaração da tabela
  var LoteMateriaPrima = sequelize.define('LoteMateriaPrima', {
  }, {timestamps: false, freezeTableName: true});

  // Relacionamento dessa entidade com outras
  LoteMateriaPrima.associate = (models) => {
    LoteMateriaPrima.belongsTo(models.MateriaPrima); // <- Cria chave estrangeira MateriaPrimaId nessa tabela
  }

  return LoteMateriaPrima;
}