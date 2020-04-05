module.exports = (sequelize, DataTypes) => {

  // Declaração da tabela
  var LoteRaspagem = sequelize.define('LoteRaspagem', {
    data: DataTypes.DATE,
    qtd_aprovadas: DataTypes.INTEGER
  }, {timestamps: false, freezeTableName: true});

  // Relacionamento dessa entidade com outras
  LoteRaspagem.associate = (models) => {
    LoteRaspagem.belongsTo(models.Usuario); // <- Cria chave estrangeira UsuarioId nessa tabela
  }

  return LoteRaspagem;
}