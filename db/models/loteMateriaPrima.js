module.exports = (sequelize, DataTypes) => {

  // Declaração da tabela
  var LoteMateriaPrima = sequelize.define('LoteMateriaPrima', {
    qtd_atual: DataTypes.DOUBLE
  }, {timestamps: false, freezeTableName: true});

  // Relacionamento dessa entidade com outras
  LoteMateriaPrima.associate = (models) => {
    LoteMateriaPrima.belongsTo(models.MateriaPrima, {foreignKey: {allowNull: false}}); // <- Cria chave estrangeira MateriaPrimaId nessa tabela
    LoteMateriaPrima.belongsTo(models.TransacaoMateriaPrima, {foreignKey: {allowNull: false}, as: 'PrimeiraTransacao', constraints: false}); // <- Cria chave estrangeira PrimeiraTransacaoId nessa tabela
  }

  return LoteMateriaPrima;
}