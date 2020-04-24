module.exports = (sequelize, DataTypes) => {

  // Declaração da tabela
  var TransacaoFilamento = sequelize.define('TransacaoFilamento', {
    qtd: DataTypes.DOUBLE,
    tipo: DataTypes.STRING,
    data: DataTypes.DATE,
    observacao: DataTypes.STRING
  }, {timestamps: false, freezeTableName: true});

  // Relacionamento dessa entidade com outras
  TransacaoFilamento.associate = (models) => {
    TransacaoFilamento.belongsTo(models.LoteFilamento, {foreignKey: {allowNull: false}}); // <- Cria chave estrangeira LoteFilamentoId nessa tabela
    TransacaoFilamento.belongsTo(models.EntidadeExterna, {foreignKey: {allowNull: false}}); // <- Cria chave estrangeira EntidadeExternaId nessa tabela
    TransacaoFilamento.belongsTo(models.Usuario, {foreignKey: {allowNull: false}}); // <- Cria chave estrangeira UsuarioId nessa tabela
  }

  return TransacaoFilamento;
}