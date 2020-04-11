var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.get('/usuario', function(req, res) {
  db.Usuario.findAll({order: [['id', 'DESC']]}).then(r => res.render("forms/usuario", {usuarios: r}));
});

router.post('/usuario', function(req, res) {
  db.Usuario.create({
    nome: req.body.nome,
    email: req.body.email,
    telefone: req.body.telefone
  })
  .then(r => res.redirect("usuario"));
});

router.put('/usuario', function(req, res) {
  var data = {};
  data[req.body.key] = req.body.value;
  // O campo fields faz com que apenas esses campos possam ser alterados pelo update, se alguém mal-intencioando colocar key=alguma outra coisa o update não vai fazer nada
  db.Usuario.update(data, {where: {id: parseInt(req.body.id)}, fields: ['nome', 'email', 'telefone']}).then(rows => {
    res.send(rows);
  });
});

router.get('/usuarioExterno', async function(req, res) {
  var data = {};
  data.entidadesExternas = await db.EntidadeExterna.findAll();
  data.usuarios = await db.UsuarioExterno.findAll({order: [['id', 'DESC']], include: db.EntidadeExterna});
  res.render("forms/usuarioExterno", data);
});

router.post('/usuarioExterno', function(req, res) {
  db.UsuarioExterno.create({
    nome: req.body.nome,
    email: req.body.email,
    telefone: req.body.telefone,
    EntidadeExternaId: parseInt(req.body.EntidadeExternaId)
  })
  .then(r => res.redirect("usuarioExterno"));
});

router.put('/usuarioExterno', function(req, res) {
  var data = {};
  data[req.body.key] = req.body.value;
  // O campo fields faz com que apenas esses campos possam ser alterados pelo update, se alguém mal-intencioando colocar key=alguma outra coisa o update não vai fazer nada
  db.UsuarioExterno.update(data, {where: {id: parseInt(req.body.id)}, fields: ['nome', 'email', 'telefone', 'EntidadeExternaId']}).then(rows => {
    res.send(rows);
  });
});

router.get('/cliente', function(req, res) {
  db.Cliente.findAll({order: [['id', 'DESC']]}).then(r => res.render("forms/cliente", {clientes: r}));
});

router.post('/cliente', function(req, res) {
  db.Cliente.create({
    nome: req.body.nome,
    demanda: parseInt(req.body.demanda),
    email: req.body.email,
    nomeRepresentante: req.body.nomeRepresentante,
    telefone: req.body.telefone
  })
  .then(r => res.redirect("cliente"));
});

router.put('/cliente', function(req, res) {
  var data = {};
  data[req.body.key] = req.body.value;
  db.Cliente.update(data, {where: {id: parseInt(req.body.id)}, fields: ['nome', 'demanda', 'email', 'nomeRepresentante', 'telefone']}).then(rows => {
    res.send(rows);
  });
});

router.get('/entidadeExterna', function(req, res) {
  db.EntidadeExterna.findAll({order: [['id', 'DESC']]}).then(r => res.render("forms/entidadeExterna", {entidades: r}));
});

router.post('/entidadeExterna', function(req, res) {
  db.EntidadeExterna.create({
    nome: req.body.nome,
    email: req.body.email,
    nomeRepresentante: req.body.nomeRepresentante,
    telefone: req.body.telefone
  })
  .then(r => res.redirect("entidadeExterna"));
});

router.put('/entidadeExterna', function(req, res) {
  var data = {};
  data[req.body.key] = req.body.value;
  db.EntidadeExterna.update(data, {where: {id: parseInt(req.body.id)}, fields: ['nome', 'email', 'nomeRepresentante', 'telefone']}).then(rows => {
    res.send(rows);
  });
});

router.get('/materiaPrima', function(req, res) {
  db.MateriaPrima.findAll({order: [['id', 'DESC']]}).then(r => res.render("forms/materiaPrima", {materiasprimas: r}));
});

router.post('/materiaPrima', function(req, res) {
  db.MateriaPrima.create({
    nome: req.body.nome,
    tipo: req.body.tipo,
    descricao: req.body.descricao,
    unidade: req.body.unidade,
    qtd_unidade: parseFloat(req.body.qtd_unidade),
    qtd_atual: 0
  })
  .then(r => res.redirect("materiaPrima"));
});

router.put('/materiaPrima', function(req, res) {
  var data = {};
  data[req.body.key] = req.body.value;
  db.MateriaPrima.update(data, {where: {id: parseInt(req.body.id)}, fields: ['nome', 'tipo', 'descricao', 'qtd_unidade', 'unidade']}).then(rows => {
    res.send(rows);
  });
});

router.get('/loteMateriaPrima', async function(req, res) {
  var data = {};
  data.materiasPrimas = await db.MateriaPrima.findAll();
  data.entidadesExternas = await db.EntidadeExterna.findAll();
  data.usuarios = await db.Usuario.findAll();
  data.tiposMateriaPrima = await db.MateriaPrima.aggregate('tipo', 'DISTINCT', {plain: false});
  console.log(data.tiposMateriaPrima);
  data.lotes = await db.LoteMateriaPrima.findAll({
    order: [['id', 'DESC']],
    include: [
      db.MateriaPrima, 
      {model: db.TransacaoMateriaPrima, as: "PrimeiraTransacao", include: [db.EntidadeExterna, db.Usuario]}
    ]
  });
  res.render("forms/loteMateriaPrima", data);
});

router.post('/loteMateriaPrima', async function(req, res) {
  try {
    // Quantidade a ser inserida
    var qtd = parseFloat(req.body.qtd);

    // Criamos um LoteMateriaPrima
    var lote = await db.LoteMateriaPrima.create({
      MateriaPrimaId: req.body.MateriaPrimaId,
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
      tipo: req.body.tipo,
      data: moment(req.body.data).toISOString(),
      observacao: req.body.observacao,
      LoteMateriaPrimaId: lote.id,
      EntidadeExternaId: req.body.EntidadeExternaId,
      UsuarioId: req.body.UsuarioId
    });

    // Atualizamos no lote a referência à primeira transação do lote
    lote.PrimeiraTransacaoId = transacao.id;
    lote.save();

    // Finalizamos redirecionando para o GET
    res.redirect("loteMateriaPrima");
  }
  catch(e){
    res.send(e);
  }
});

router.post('/loteMateriaPrima/atualizar', async function(req, res) {
  try {
    var qtd = (req.body.sinal == "entrada" ? 1 : -1) * parseFloat(req.body.qtd);
    var lote = await db.LoteMateriaPrima.findOne({where: {id: parseInt(req.body.LoteMateriaPrimaId)}});
    var materiaPrima = await lote.getMateriaPrima();
    
    materiaPrima.qtd_atual += qtd;
    lote.qtd_atual += qtd;

    // Adicionamos a transação
    var transacao = await db.TransacaoMateriaPrima.create({
      qtd: qtd,
      tipo: req.body.tipo,
      data: moment(req.body.data).toISOString(),
      observacao: req.body.observacao,
      LoteMateriaPrimaId: lote.id,
      EntidadeExternaId: req.body.EntidadeExternaId,
      UsuarioId: req.body.UsuarioId
    });

    // Atualizamos
    materiaPrima.save();
    lote.save();

    // Finalizamos redirecionando para o GET
    res.redirect("../loteMateriaPrima");
  }
  catch(e){
    res.send(e);
  }
});

router.get('/loteMateriaPrima/historico/:id', async function(req, res) {
  var data = {};
  data.transacoes = await db.TransacaoMateriaPrima.findAll({
    where: {LoteMateriaPrimaId: req.params.id},
    include: [db.Usuario, db.EntidadeExterna],
    order: [['data', 'DESC'], ['id', 'DESC']]
  });
  res.send(data);
});

router.get('/loteMateriaPrima/desfazerTransacao/:id', async function(req, res) {
  try {
    var transacao = await db.TransacaoMateriaPrima.findOne({
      where: {id: req.params.id},
      include: [db.EntidadeExterna, db.LoteMateriaPrima]
    })
    var lote = await transacao.getLoteMateriaPrima();
    var materiaPrima = await lote.getMateriaPrima();
  
    if(lote.PrimeiraTransacaoId == transacao.id){
      res.send("Não é possível desfazer a primeira transação");
    }
    else {
  
      lote.qtd_atual -= transacao.qtd;
      materiaPrima.qtd_atual -= transacao.qtd;
  
      lote.save();
      materiaPrima.save();
      transacao.destroy();
  
      res.redirect("../../loteMateriaPrima");
  
    }
  }
  catch(e){
    res.send(e);
  }
});

router.get('/loteFilamento', async function(req, res) {
  var data = {};
  data.entidadesExternas = await db.EntidadeExterna.findAll();
  data.usuarios = await db.Usuario.findAll();
  data.lotes = await db.LoteFilamento.findAll({
    order: [['id', 'DESC']],
    include: [
      {model: db.TransacaoFilamento, as: "PrimeiraTransacao", include: [db.EntidadeExterna, db.Usuario]}
    ]
  });
  res.render("forms/loteFilamento", data);
});

router.post('/loteFilamento', async function(req, res) {
  try {
    // Quantidade a ser inserida
    var qtd = parseInt(req.body.qtd);
    var massa_rolo = parseFloat(req.body.massa_rolo);

    // Criamos um LoteFilamento
    var lote = await db.LoteFilamento.create({
      PrimeiraTransacaoId: 0,
      qtd_atual: qtd,
      massa_rolo: massa_rolo
    });

    // Adicionamos a transação
    var transacao = await db.TransacaoFilamento.create({
      qtd: qtd,
      tipo: req.body.tipo,
      data: moment(req.body.data).toISOString(),
      observacao: req.body.observacao,
      LoteFilamentoId: lote.id,
      EntidadeExternaId: req.body.EntidadeExternaId,
      UsuarioId: req.body.UsuarioId
    });

    // Atualizamos no lote a referência à primeira transação do lote
    lote.PrimeiraTransacaoId = transacao.id;
    lote.save();

    // Finalizamos redirecionando para o GET
    res.redirect("loteFilamento");
  }
  catch(e){
    res.send(e);
  }
});

router.get('/loteImpressao', async function(req, res) {
  var data = {}
  data.lotes = await db.LoteImpressao.findAll({order: [['id', 'DESC']], include: db.Usuario});
  data.usuarios = await db.Usuario.findAll();
  res.render("forms/loteImpressao", data);
});

router.post('/loteImpressao', async function(req, res) {
  db.LoteImpressao.create({
    qtd_aprovadas: parseInt(req.body.qtd_aprovadas),
    qtd_reprovadas: parseInt(req.body.qtd_reprovadas),
    data: moment(req.body.data).toISOString(),
    cod_impressora: req.body.cod_impressora,
    UsuarioId: req.body.UsuarioId
  })
  .then(r => res.redirect("loteImpressao"));
});

router.get('/lote', async function(req, res) {
  var data = {}
  data.lotes = await db.Lote.findAll({order: [['id', 'DESC']]});
  res.render("forms/lote", data);
});

router.post('/lote', async function(req, res) {
  db.Lote.create({
    data: moment(req.body.data).toISOString()
  })
  .then(r => res.redirect("lote"));
});

router.get('/subloteImpressao', async function(req, res) {
  var data = {}
  data.lotes = await db.Lote.findAll({order: [['id', 'DESC']]});
  data.suportes = await db.SubloteImpressao.findAll({order: [['id', 'DESC']], include: [db.Lote]});
  data.usuarios = await db.Usuario.findAll();
  res.render("forms/subloteImpressao", data);
});

router.post('/subloteImpressao', async function(req, res) {
  db.SubloteImpressao.create({
    LoteId: parseInt(req.body.LoteId),
    cod_impressora: req.body.cod_impressora,
    UsuarioId: parseInt(req.body.UsuarioId),
    qtd_suporte_bruto_aprovado: parseInt(req.body.qtd_suporte_bruto_aprovado || 0),
    qtd_suporte_bruto_aproveitavel: parseInt(req.body.qtd_suporte_bruto_aproveitavel || 0),
    qtd_suporte_bruto_descartavel: parseInt(req.body.qtd_suporte_bruto_aproveitavel || 0),
    qtd_suporte_aprovado: parseInt(req.body.qtd_suporte_aprovado || 0),
    qtd_suporte_aproveitavel: parseInt(req.body.qtd_suporte_aproveitavel || 0),
    qtd_suporte_descartavel: parseInt(req.body.qtd_suporte_aproveitavel || 0)
  })
  .then(r => res.redirect("subloteImpressao"))
  .catch(e => res.send(e));
});

router.get('/subloteElastico', async function(req, res) {
  var data = {}
  data.lotes = await db.Lote.findAll({order: [['id', 'DESC']]});
  data.elasticos = await db.SubloteElastico.findAll({order: [['id', 'DESC']], include: [db.Lote]});
  data.usuarios = await db.Usuario.findAll();
  res.render("forms/subloteElastico", data);
});

router.post('/subloteElastico', async function(req, res) {
  db.SubloteElastico.create({
    LoteId: parseInt(req.body.LoteId),
    UsuarioId: parseInt(req.body.UsuarioId),
    qtd_elastico_aproveitavel: parseInt(req.body.qtd_elastico_aproveitavel || 0),
    qtd_elastico_descartavel: parseInt(req.body.qtd_elastico_descartavel || 0)
  })
  .then(r => res.redirect("subloteElastico"))
  .catch(e => res.send(e));
});

router.get('/subloteVisores', async function(req, res) {
  var data = {}
  data.lotes = await db.Lote.findAll({order: [['id', 'DESC']]});
  data.visores = await db.SubloteVisores.findAll({order: [['id', 'DESC']], include: [db.Lote]});
  data.usuarios = await db.Usuario.findAll();
  res.render("forms/subloteVisores", data);
});

router.post('/subloteVisores', async function(req, res) {
  db.SubloteVisores.create({
    LoteId: parseInt(req.body.LoteId),
    UsuarioId: parseInt(req.body.UsuarioId),
    qtd_visores_aproveitavel: parseInt(req.body.qtd_visores_aproveitavel || 0),
    qtd_visores_descartavel: parseInt(req.body.qtd_visores_descartavel || 0)
  })
  .then(r => res.redirect("subloteVisores"))
  .catch(e => res.send(e));
});

router.get('/loteRaspagem', async function(req, res) {
  var data = {}
  data.lotes = await db.LoteRaspagem.findAll({order: [['id', 'DESC']], include: db.Usuario});
  data.usuarios = await db.Usuario.findAll();
  res.render("forms/loteRaspagem", data);
});

router.post('/loteRaspagem', async function(req, res) {
  db.LoteRaspagem.create({
    qtd_aprovadas: parseInt(req.body.qtd_aprovadas),
    data: moment(req.body.data).toISOString(),
    UsuarioId: req.body.UsuarioId
  })
  .then(r => res.redirect("loteRaspagem"));
});

router.get('/falhasRaspagem', async function(req, res) {
  data = {}
  data.loteImpressao = await db.LoteImpressao.findAll({attributes:['Id']});
  res.render("forms/falhasRaspagem", data);
});

router.get('/loteCorteVisor', async function(req, res) {
  data = {}
  data.usuarios = await db.Usuario.findAll({attributes:['id', 'nome']});
  data.transacaoMateriaPrima = await db.TransacaoMateriaPrima.findAll({attributes:['id']});
  res.render("forms/loteCorteVisor", data);
});

router.get('/loteCorteElastico', async function(req, res) {
  data = {}
  data.usuarios = await db.Usuario.findAll({attributes:['id', 'nome']});
  data.transacaoMateriaPrima = await db.TransacaoMateriaPrima.findAll({attributes:['id']});
 
  res.render("forms/loteCorteElastico", data);
});

router.get('/loteMontagem', async function(req, res) {
  data = {}
  data.usuarios = await db.Usuario.findAll({attributes:['id', 'nome']});
  data.loteRaspagem = await db.LoteRaspagem.findAll({attributes:['Id']});
  data.loteVisor = await db.LoteCorteVisor.findAll({attributes:['Id']});
  data.loteElastico = await db.LoteCorteElastico.findAll({attributes:['Id']});

  res.render("forms/loteMontagem", data);
});

router.get('/loteEmbalagemPrimaria', async function(req, res) {
  data = {}
  data.usuarios = await db.Usuario.findAll({attributes:['id', 'nome']});
  data.lotes = await db.Lote.findAll({attributes:['id']});

  res.render("forms/loteEmbalagemPrimaria", data);
});

router.post('/loteEmbalagemPrimaria', async function(req, res) {
  db.LoteEmbalagemPrimaria.create({
    data: moment(req.body.data).toISOString(),
    LoteId: parseInt(req.body.LoteId),
    UsuarioId: parseInt(req.body.UsuarioId)
  })
  .then(r => res.redirect("loteEmbalagemPrimaria"));
});

router.get('/pacoteFinal', function(req, res) {
  res.render("forms/pacoteFinal");
});

router.get('/entregaFinal', function(req, res) {
  res.render("forms/entregaFinal");
});

router.get('/datas', function(req, res) {
  data = req.query
  const table = data["table"]
  delete data["table"]
  db[table].findAll(data).then(name =>
    res.send(name)
  ); 
})


module.exports = router;
