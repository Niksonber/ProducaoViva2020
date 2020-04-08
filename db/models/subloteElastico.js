module.exports = (sequelize, DataTypes) => {

  // Declaração da tabela
  var SubloteElastico = sequelize.define('SubloteElastico', {
    data: DataTypes.DATE,
    qtd_elastico_aproveitavel: DataTypes.INTEGER,
    qtd_elastico_descartavel: DataTypes.INTEGER
  }, {timestamps: false, freezeTableName: true});

  // Relacionamento dessa entidade com outras
  SubloteElastico.associate = (models) => {
    SubloteElastico.belongsTo(models.Lote, {foreignKey: {allowNull: false}}); // <- Cria chave estrangeira LoteId nessa tabela
    SubloteElastico.belongsTo(models.Usuario, {foreignKey: {allowNull: false}}); // <- Cria chave estrangeira UsuarioId nessa tabela
  }

  return SubloteElastico;
}