module.exports = (sequelize, DataTypes) => {

  // Declaração da tabela
  var LoteMateriaPrima = sequelize.define('LoteMateriaPrima', {
    qtd_atual: DataTypes.DOUBLE
  }, {timestamps: false, freezeTableName: true});

  // Relacionamento dessa entidade com outras
  LoteMateriaPrima.associate = (models) => {
    LoteMateriaPrima.belongsTo(models.MateriaPrima, {foreignKey: {allowNull: false}}); // <- Cria chave estrangeira MateriaPrimaId nessa tabela
    LoteMateriaPrima.belongsTo(models.TransacaoMateriaPrima, {foreignKey: {allowNull: false}, as: 'PrimeiraTransacao', constraints: false}); // <- Cria chave estrangeira PrimeiraTransacaoId nessa tabela
  }

  /*
    @params: data = {qtd, MateriaPrimaId, tipo, data, observacaco, EntidadeExternaId, UsuarioId}
   */
  LoteMateriaPrima.createWithTransaction = async function(data){
    // Quantidade a ser inserida
    var qtd = parseFloat(data.qtd) || 0;

    // Criamos um LoteMateriaPrima
    var lote = await db.LoteMateriaPrima.create({
      MateriaPrimaId: data.MateriaPrimaId,
      PrimeiraTransacaoId: 0,
      qtd_atual: qtd
    });

    // Obtém a matéria prima desse lote
    var materiaPrima = await lote.getMateriaPrima();
    
    // Atualizamos a massa da matéria prima
    materiaPrima.qtd_atual += qtd;
    materiaPrima.save();

    // Adicionamos a transação
    var transacao = await db.TransacaoMateriaPrima.create({
      qtd: qtd,
      tipo: data.tipo,
      data: moment(data.data).toISOString(),
      observacao: data.observacao,
      LoteMateriaPrimaId: lote.id,
      EntidadeExternaId: data.EntidadeExternaId,
      UsuarioId: data.UsuarioId
    });

    // Atualizamos no lote a referência à primeira transação do lote
    lote.PrimeiraTransacaoId = transacao.id;
    lote.save();
  }

  /*
    @params data: {sinal, qtd, tipo, data, observacao, EntidadeExternaId, UsuarioId}
   */
  LoteMateriaPrima.prototype.updateWithTransaction = async function(data){
    var qtd = (data.sinal == "entrada" ? 1 : -1) * (parseFloat(data.qtd) || 0);
    var materiaPrima = await this.getMateriaPrima();
    
    materiaPrima.qtd_atual += qtd;
    this.qtd_atual += qtd;

    // Adicionamos a transação
    var transacao = await db.TransacaoMateriaPrima.create({
      qtd: qtd,
      tipo: data.tipo,
      data: moment(data.data).toISOString(),
      observacao: data.observacao,
      LoteMateriaPrimaId: this.id,
      EntidadeExternaId: data.EntidadeExternaId,
      UsuarioId: data.UsuarioId
    });

    // Atualizamos
    materiaPrima.save();
    this.save();
  }

  return LoteMateriaPrima;
}