module.exports = (sequelize, DataTypes) => {

  // Declaração da tabela
  var EntregaFinal = sequelize.define('EntregaFinal', {
    nomeRepresentanteCliente: DataTypes.STRING,
    data: DataTypes.DATE
  }, {timestamps: false, freezeTableName: true});

  // Relacionamento dessa entidade com outras
  EntregaFinal.associate = (models) => {
    EntregaFinal.belongsTo(models.Cliente); // <- Cria chave estrangeira ClienteId nessa tabela
    EntregaFinal.belongsTo(models.PacoteFinal); // <- Cria chave estrangeira PacoteFinalId nessa tabela
    EntregaFinal.belongsTo(models.Usuario); // <- Cria chave estrangeira UsuarioId nessa tabela
  }

  return EntregaFinal;
}