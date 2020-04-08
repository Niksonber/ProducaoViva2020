module.exports = (sequelize, DataTypes) => {

  // Declaração da tabela
  var SubloteImpressao = sequelize.define('SubloteImpressao', {
    data: DataTypes.DATE,
    qtd_suporte_bruto_aprovado: DataTypes.INTEGER,
    qtd_suporte_bruto_aproveitavel: DataTypes.INTEGER,
    qtd_suporte_bruto_descartavel: DataTypes.INTEGER,
    qtd_suporte_aprovado: DataTypes.INTEGER,
    qtd_suporte_aproveitavel: DataTypes.INTEGER,
    qtd_suporte_descartavel: DataTypes.INTEGER,
    cod_impressora: DataTypes.STRING
  }, {timestamps: false, freezeTableName: true});

  // Relacionamento dessa entidade com outras
  SubloteImpressao.associate = (models) => {
    SubloteImpressao.belongsTo(models.Lote, {foreignKey: {allowNull: false}}); // <- Cria chave estrangeira LoteId nessa tabela
    SubloteImpressao.belongsTo(models.Usuario, {foreignKey: {allowNull: false}}); // <- Cria chave estrangeira UsuarioId nessa tabela
  }

  return SubloteImpressao;
}