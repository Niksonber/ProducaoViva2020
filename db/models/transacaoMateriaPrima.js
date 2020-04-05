module.exports = (sequelize, DataTypes) => {

  // Declaração da tabela
  var TransacaoMateriaPrima = sequelize.define('TransacaoMateriaPrima', {
    qtd: DataTypes.DOUBLE,
    tipo: DataTypes.STRING,
    data: DataTypes.DATE,
    observacao: DataTypes.STRING
  }, {timestamps: false, freezeTableName: true});

  // Relacionamento dessa entidade com outras
  TransacaoMateriaPrima.associate = (models) => {
    TransacaoMateriaPrima.belongsTo(models.LoteMateriaPrima); // <- Cria chave estrangeira LoteMateriaPrimaId nessa tabela
    TransacaoMateriaPrima.belongsTo(models.EntidadeExterna); // <- Cria chave estrangeira EntidadeExternaId nessa tabela
    TransacaoMateriaPrima.belongsTo(models.Usuario); // <- Cria chave estrangeira UsuarioId nessa tabela
  }

  return TransacaoMateriaPrima;
}