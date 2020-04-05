module.exports = (sequelize, DataTypes) => {

  // Declaração da tabela
  var LoteCorteElastico = sequelize.define('LoteCorteElastico', {
    data: DataTypes.DATE,
    qtd_elasticos: DataTypes.INTEGER,
  }, {timestamps: false, freezeTableName: true});

  // Relacionamento dessa entidade com outras
  LoteCorteElastico.associate = (models) => {
    LoteCorteElastico.belongsTo(models.TransacaoMateriaPrima); // <- Cria chave estrangeira TransacaoMateriaPrimaId nessa tabela
  }

  return LoteCorteElastico;
}