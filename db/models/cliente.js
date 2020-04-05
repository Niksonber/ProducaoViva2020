module.exports = (sequelize, DataTypes) => {

  // Declaração da tabela
  var Cliente = sequelize.define('Cliente', {
    nome: DataTypes.STRING,
    demanda: DataTypes.INTEGER,
    contato: DataTypes.STRING
  }, {timestamps: false, freezeTableName: true});

  return Cliente;
}