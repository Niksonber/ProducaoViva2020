module.exports = (sequelize, DataTypes) => {

  // Declaração da tabela
  var MateriaPrima = sequelize.define('MateriaPrima', {
    nome: DataTypes.STRING,
    descricao: DataTypes.STRING,
    tipo: DataTypes.STRING,
    qtd_atual: DataTypes.DOUBLE,
    qtd_unidade: DataTypes.DOUBLE,
    unidade: DataTypes.STRING
  }, {timestamps: false, freezeTableName: true});

  MateriaPrima.prototype.nomeMassa = function(){
    return this.nome + " (" + this.qtd_unidade + this.unidade + ")";
  }

  return MateriaPrima;
}