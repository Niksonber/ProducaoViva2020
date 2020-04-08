module.exports = (sequelize, DataTypes) => {

  // Declaração da tabela
  var SubloteVisores = sequelize.define('SubloteVisores', {
    data: DataTypes.DATE,
    qtd_visores_aproveitavel: DataTypes.INTEGER,
    qtd_visores_descartavel: DataTypes.INTEGER
  }, {timestamps: false, freezeTableName: true});

  // Relacionamento dessa entidade com outras
  SubloteVisores.associate = (models) => {
    SubloteVisores.belongsTo(models.Lote, {foreignKey: {allowNull: false}}); // <- Cria chave estrangeira LoteId nessa tabela
    SubloteVisores.belongsTo(models.Usuario, {foreignKey: {allowNull: false}}); // <- Cria chave estrangeira UsuarioId nessa tabela
  }

  return SubloteVisores;
}