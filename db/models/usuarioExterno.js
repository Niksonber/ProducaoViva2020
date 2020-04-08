module.exports = (sequelize, DataTypes) => {

  // Declaração da tabela
  var UsuarioExterno = sequelize.define('UsuarioExterno', {
    nome: DataTypes.STRING,
    email: DataTypes.STRING,
    telefone: DataTypes.STRING
  }, {timestamps: false, freezeTableName: true});

  // Relacionamento dessa entidade com outras
  UsuarioExterno.associate = (models) => {
    UsuarioExterno.belongsTo(models.EntidadeExterna, {foreignKey: {allowNull: false}}); // <- Cria chave estrangeira EntidadeExternaId nessa tabela
  }

  return UsuarioExterno;
}