module.exports = (sequelize, DataTypes) => {

  // Declaração da tabela
  var EntidadeProcesso = sequelize.define('EntidadeProcesso', {
    processo: DataTypes.STRING
  }, {timestamps: false, freezeTableName: true});

  // Relacionamento dessa entidade com outras
  EntidadeProcesso.associate = (models) => {
    EntidadeProcesso.belongsTo(models.EntidadeExterna, {foreignKey: {allowNull: false}}); // <- Cria chave estrangeira EntidadeExternaId nessa tabela
  }

  return EntidadeProcesso;
}