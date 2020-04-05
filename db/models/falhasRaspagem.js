module.exports = (sequelize, DataTypes) => {

  // Declaração da tabela
  var FalhasRaspagem = sequelize.define('FalhasRaspagem', {
    qtd_falhas: DataTypes.INTEGER
  }, {timestamps: false, freezeTableName: true});

  // Relacionamento dessa entidade com outras
  FalhasRaspagem.associate = (models) => {
    FalhasRaspagem.belongsTo(models.LoteImpressao); // <- Cria chave estrangeira LoteImpressaoId nessa tabela
    FalhasRaspagem.belongsTo(models.LoteRaspagem); // <- Cria chave estrangeira LoteRaspagemId nessa tabela
  }

  return FalhasRaspagem;
}