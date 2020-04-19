module.exports = (sequelize, DataTypes) => {

  // Declaração da tabela
  var EntidadeExterna = sequelize.define('EntidadeExterna', {
    nome: DataTypes.STRING,
    email: DataTypes.STRING,
    nomeRepresentante: DataTypes.STRING,
    telefone: DataTypes.STRING
  }, {timestamps: false, freezeTableName: true});

  // Relacionamento dessa entidade com outras
  EntidadeExterna.associate = (models) => {
    EntidadeExterna.hasMany(models.EntidadeProcesso, {foreignKey: {allowNull: false}});
  }

  return EntidadeExterna;
}