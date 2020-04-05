module.exports = (sequelize, DataTypes) => {

  // Declaração da tabela
  var LoteEmbalagemPrimaria = sequelize.define('LoteEmbalagemPrimaria', {
    data: DataTypes.DATE
  }, {timestamps: false, freezeTableName: true});

  // Relacionamento dessa entidade com outras
  LoteEmbalagemPrimaria.associate = (models) => {
    LoteEmbalagemPrimaria.belongsTo(models.LoteMontagem); // <- Cria chave estrangeira LoteMontagemId nessa tabela
    LoteEmbalagemPrimaria.belongsTo(models.Usuario); // <- Cria chave estrangeira UsuarioId nessa tabela
  }

  return LoteEmbalagemPrimaria;
}