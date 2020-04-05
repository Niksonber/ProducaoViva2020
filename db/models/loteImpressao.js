module.exports = (sequelize, DataTypes) => {

  // Declaração da tabela
  var LoteImpressao = sequelize.define('LoteImpressao', {
    data: DataTypes.DATE,
    qnt_aprovadas: DataTypes.INTEGER,
    qnt_reprovadas: DataTypes.INTEGER,
    cod_impressora: DataTypes.STRING
  }, {timestamps: false, freezeTableName: true});

  // Relacionamento dessa entidade com outras
  LoteImpressao.associate = (models) => {
    LoteImpressao.belongsTo(models.Usuario); // <- Cria chave estrangeira UsuarioId nessa tabela
  }

  return LoteImpressao;
}