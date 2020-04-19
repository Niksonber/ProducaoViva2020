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

    if(qtd < 0) return false;

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
      UsuarioId: data.UsuarioId,
      allowUndo: false
    });

    // Atualizamos no lote a referência à primeira transação do lote
    lote.PrimeiraTransacaoId = transacao.id;
    lote.save();

    return transacao;
  }

  /*
    @params data: {sinal, qtd, tipo, data, observacao, EntidadeExternaId, UsuarioId}
   */
  LoteMateriaPrima.prototype.updateWithTransaction = async function(data){
    var qtd = (data.sinal == "entrada" ? 1 : -1) * (parseFloat(data.qtd) || 0);
    var materiaPrima = await this.getMateriaPrima();

    if(this.qtd_atual+qtd < 0) return false;
    
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
      UsuarioId: data.UsuarioId,
      allowUndo: data.allowUndo
    });

    // Atualizamos
    materiaPrima.save();
    this.save();

    return transacao;
  }

  LoteMateriaPrima.undoTransaction = async function(TransacaoId){
    var transacao = await db.TransacaoMateriaPrima.findOne({
      where: {id: TransacaoId},
      include: [db.EntidadeExterna, db.LoteMateriaPrima]
    })
    var lote = await transacao.getLoteMateriaPrima();
    var materiaPrima = await lote.getMateriaPrima();
  
    if(lote.PrimeiraTransacaoId == transacao.id){
      return "Não é possível desfazer a primeira transação";
    }
    else if(transacao.allowUndo == false){
      return "Essa transação não permite ser desfeita";
    }
    else if(lote.qtd_atual-transacao.qtd < 0){
      return "Desfazer essa transação faz o lote ter quantidade negativa: " + lote.qtd_atual + " -> " + (lote.qtd_atual-transacao.qtd);
    }
    else {
  
      lote.qtd_atual -= transacao.qtd;
      materiaPrima.qtd_atual -= transacao.qtd;
  
      lote.save();
      materiaPrima.save();
      transacao.destroy();

      return true;
  
    }
  }

  return LoteMateriaPrima;
}