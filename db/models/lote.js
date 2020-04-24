module.exports = (sequelize, DataTypes) => {

  // Declaração da tabela
  var Lote = sequelize.define('Lote', {
    data: DataTypes.DATE,
    qtd_faceshields: DataTypes.INTEGER
  }, {timestamps: false, freezeTableName: true});

  // Relacionamento dessa entidade com outras
  Lote.associate = (models) => {
    Lote.hasMany(models.SubloteImpressao, {foreignKey: {allowNull: false}});
  }

  return Lote;
}