module.exports = (sequelize, DataTypes) => {

  // Declaração da tabela
  var LoteEmbalagemPrimaria = sequelize.define('LoteEmbalagemPrimaria', {
    qtd: DataTypes.INTEGER,
    data: DataTypes.DATE
  }, {timestamps: false, freezeTableName: true});

  // Relacionamento dessa entidade com outras
  LoteEmbalagemPrimaria.associate = (models) => {
    LoteEmbalagemPrimaria.belongsTo(models.Lote); // <- Cria chave estrangeira LoteId nessa tabela
    LoteEmbalagemPrimaria.belongsTo(models.Usuario); // <- Cria chave estrangeira UsuarioId nessa tabela
  }

  return LoteEmbalagemPrimaria;
}