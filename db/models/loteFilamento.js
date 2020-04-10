module.exports = (sequelize, DataTypes) => {

  // Declaração da tabela
  var LoteFilamento = sequelize.define('LoteFilamento', {
    massa_rolo: DataTypes.DOUBLE,
    qtd_atual: DataTypes.DOUBLE
  }, {timestamps: false, freezeTableName: true});

  // Relacionamento dessa entidade com outras
  LoteFilamento.associate = (models) => {
    LoteFilamento.belongsTo(models.TransacaoFilamento, {foreignKey: {allowNull: false}, as: 'PrimeiraTransacao', constraints: false}); // <- Cria chave estrangeira PrimeiraTransacaoId nessa tabela
  }

  return LoteFilamento;
}