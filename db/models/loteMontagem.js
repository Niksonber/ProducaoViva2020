module.exports = (sequelize, DataTypes) => {

  // Declaração da tabela
  var LoteMontagem = sequelize.define('LoteMontagem', {
    data: DataTypes.DATE,
    qtd_faceshields: DataTypes.INTEGER
  }, {timestamps: false, freezeTableName: true});

  // Relacionamento dessa entidade com outras
  LoteMontagem.associate = (models) => {
    LoteMontagem.belongsTo(models.LoteRaspagem); // <- Cria chave estrangeira LoteRaspagemId nessa tabela
    LoteMontagem.belongsTo(models.LoteCorteVisor); // <- Cria chave estrangeira LoteCorteVisorId nessa tabela
    LoteMontagem.belongsTo(models.LoteCorteElastico); // <- Cria chave estrangeira LoteCorteElasticoId nessa tabela
    LoteMontagem.belongsTo(models.Usuario); // <- Cria chave estrangeira UsuarioId nessa tabela
  }

  return LoteMontagem;
}