module.exports = (sequelize, DataTypes) => {

  // Declaração da tabela
  var ProcessamentoPETG = sequelize.define('ProcessamentoPETG', {
    estado: DataTypes.BOOLEAN
  }, {timestamps: false, freezeTableName: true});

  // Relacionamento dessa entidade com outras
  ProcessamentoPETG.associate = (models) => {
    ProcessamentoPETG.belongsTo(models.TransacaoMateriaPrima, {foreignKey: {allowNull: true}, as: 'TransacaoPETG', constraints: false}); // <- Cria chave estrangeira TransacaoPETGId nessa tabela
    ProcessamentoPETG.belongsTo(models.TransacaoMateriaPrima, {foreignKey: {allowNull: true}, as: 'TransacaoVisor', constraints: false}); // <- Cria chave estrangeira TransacaoVisorId nessa tabela
  }

  return ProcessamentoPETG;
}