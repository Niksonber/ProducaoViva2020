module.exports = (sequelize, DataTypes) => {

  // Declaração da tabela
  var EmpacotamentoFinal = sequelize.define('EmpacotamentoFinal', {
    qtd_faceshields: DataTypes.INTEGER, // Número de faceshields embaladas vindas do lote de embalagem e indo para o pacote final
    data: DataTypes.DATE
  }, {timestamps: false, freezeTableName: true});

  // Relacionamento dessa entidade com outras
  EmpacotamentoFinal.associate = (models) => {
    EmpacotamentoFinal.belongsTo(models.LoteEmbalagemPrimaria); // <- Cria chave estrangeira LoteEmbalagemPrimariaId nessa tabela
    EmpacotamentoFinal.belongsTo(models.PacoteFinal); // <- Cria chave estrangeira PacoteFinalId nessa tabela
    EmpacotamentoFinal.belongsTo(models.Usuario); // <- Cria chave estrangeira UsuarioId nessa tabela
  }

  return EmpacotamentoFinal;
}