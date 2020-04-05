module.exports = (sequelize, DataTypes) => {

  // Declaração da tabela
  var LoteCorteVisor = sequelize.define('LoteCorteVisor', {
    dataEntregaVisor: DataTypes.DATE,
    nomeEntregadorVisor: DataTypes.STRING,
    qtd_visores: DataTypes.INTEGER,
    estado: DataTypes.STRING
  }, {timestamps: false, freezeTableName: true});

  // Relacionamento dessa entidade com outras
  LoteCorteVisor.associate = (models) => {
    LoteCorteVisor.belongsTo(models.TransacaoMateriaPrima); // <- Cria chave estrangeira TransacaoMateriaPrimaId nessa tabela
    LoteCorteVisor.belongsTo(models.Usuario, {foreignKey: 'UsuarioVisorReceptorId'}); // <- Cria chave estrangeira UsuarioVisorReceptorId nessa tabela
  }

  return LoteCorteVisor;
}