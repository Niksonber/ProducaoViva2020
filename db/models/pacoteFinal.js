module.exports = (sequelize, DataTypes) => {

  // Declaração da tabela
  var PacoteFinal = sequelize.define('PacoteFinal', {
    qtd_faceshields: DataTypes.INTEGER,
    data: DataTypes.DATE
  }, {timestamps: false, freezeTableName: true});

  // Relacionamento dessa entidade com outras
  PacoteFinal.associate = (models) => {
    PacoteFinal.belongsTo(models.Usuario); // <- Cria chave estrangeira UsuarioId nessa tabela
    PacoteFinal.hasMany(models.PacoteFinalLote);
  }

  return PacoteFinal;
}