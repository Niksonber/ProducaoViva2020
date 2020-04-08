module.exports = (sequelize, DataTypes) => {

  // Declaração da tabela
  var LoteFilamento = sequelize.define('LoteFilamento', {
    massa_rolo: DataTypes.DOUBLE
  }, {timestamps: false, freezeTableName: true});

  // Relacionamento dessa entidade com outras
  LoteFilamento.associate = (models) => {
    LoteFilamento.belongsTo(models.LoteMateriaPrima, {foreignKey: {allowNull: false}}); // <- Cria chave estrangeira LoteMateriaPrimaId nessa tabela
  }

  return LoteFilamento;
}