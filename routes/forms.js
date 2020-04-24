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

router.get('/entidadeProcesso', async function(req, res) {
  var data = {};
  data.entidadesExternas = await db.EntidadeExterna.findAll();
  data.entidadesProcessos = await db.EntidadeExterna.findAll({
    include: db.EntidadeProcesso
  });
  res.render("forms/entidadeProcesso", data);
});

router.post('/entidadeProcesso', function(req, res) {
  db.EntidadeProcesso.create({
    processo: req.body.processo,
    EntidadeExternaId: parseInt(req.body.EntidadeExternaId)
  })
  .then(r => res.redirect("/forms/entidadeProcesso"));
});

router.get('/entidadeProcesso/delete/:id', function(req, res) {
  db.EntidadeProcesso.destroy({where: {id: req.params.id}}).then(r => res.redirect("/forms/entidadeProcesso"));
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
    db.LoteMateriaPrima.createWithTransaction({
      qtd: req.body.qtd,
      MateriaPrimaId: req.body.MateriaPrimaId,
      tipo: req.body.tipo,
      data: req.body.data,
      observacaco: req.body.observacao,
      EntidadeExternaId: req.body.EntidadeExternaId, 
      UsuarioId: req.body.UsuarioId
    });

    // Finalizamos redirecionando para o GET
    res.redirect("loteMateriaPrima");
  }
  catch(e){
    res.send(e);
  }
});

router.post('/loteMateriaPrima/atualizar', async function(req, res) {
  try {
    var lote = await db.LoteMateriaPrima.findOne({where: {id: parseInt(req.body.LoteMateriaPrimaId)}});
    await lote.updateWithTransaction({
      sinal: req.body.sinal,
      qtd: req.body.qtd,
      tipo: req.body.tipo,
      data: req.body.data,
      observacaco: req.body.observacao,
      EntidadeExternaId: req.body.EntidadeExternaId,
      UsuarioId: req.body.UsuarioId,
      allowUndo: true
    });

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
    var result = await db.LoteMateriaPrima.undoTransaction(req.params.id);
    
    if(result == true) res.redirect("../../loteMateriaPrima");
    else res.send(result);
  }
  catch(e){
    res.send(e);
  }
});

// router.get('/loteFilamento', async function(req, res) {
//   var data = {};
//   data.entidadesExternas = await db.EntidadeExterna.findAll();
//   data.usuarios = await db.Usuario.findAll();
//   data.lotes = await db.LoteFilamento.findAll({
//     order: [['id', 'DESC']],
//     include: [
//       {model: db.TransacaoFilamento, as: "PrimeiraTransacao", include: [db.EntidadeExterna, db.Usuario]}
//     ]
//   });
//   res.render("forms/loteFilamento", data);
// });

// router.post('/loteFilamento', async function(req, res) {
//   try {
//     // Quantidade a ser inserida
//     var qtd = parseInt(req.body.qtd);
//     var massa_rolo = parseFloat(req.body.massa_rolo);

//     // Criamos um LoteFilamento
//     var lote = await db.LoteFilamento.create({
//       PrimeiraTransacaoId: 0,
//       qtd_atual: qtd,
//       massa_rolo: massa_rolo
//     });

//     // Adicionamos a transação
//     var transacao = await db.TransacaoFilamento.create({
//       qtd: qtd,
//       tipo: req.body.tipo,
//       data: moment(req.body.data).toISOString(),
//       observacao: req.body.observacao,
//       LoteFilamentoId: lote.id,
//       EntidadeExternaId: req.body.EntidadeExternaId,
//       UsuarioId: req.body.UsuarioId
//     });

//     // Atualizamos no lote a referência à primeira transação do lote
//     lote.PrimeiraTransacaoId = transacao.id;
//     lote.save();

//     // Finalizamos redirecionando para o GET
//     res.redirect("loteFilamento");
//   }
//   catch(e){
//     res.send(e);
//   }
// });

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
  data.lotessuportes = await db.Lote.findAll({include: [{model: db.SubloteImpressao, required: true}], order: [['id', 'DESC'], [db.SubloteImpressao, 'cod_impressora', 'ASC']]});
  //data.suportes = await db.SubloteImpressao.findAll({order: [['id', 'DESC']], include: [db.Lote]});
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

router.put('/subloteImpressao', function(req, res) {
  var data = {};
  data[req.body.key] = req.body.value;
  db.SubloteImpressao.update(data, {where: {id: parseInt(req.body.id)}, fields: ['qtd_suporte_bruto_aprovado', 'qtd_suporte_bruto_aproveitavel', 'qtd_suporte_bruto_descartavel', 'qtd_suporte_aprovado', 'qtd_suporte_aproveitavel', 'qtd_suporte_descartavel']}).then(rows => {
    res.send(rows);
  });
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

router.get('/processamentoElastico', async function(req, res) {
  data = {}
  data.loteRolosElastico = await db.LoteMateriaPrima.findAll({
    include: {model: db.MateriaPrima, where: {tipo: "Rolo de elástico"}}
  });
  data.elasticos = await db.MateriaPrima.findAll({
    where: {tipo: "Elástico manufaturado"}
  });
  data.entidadesExternas = await db.EntidadeExterna.findAll({
    include: {
      model: db.EntidadeProcesso,
      where: {processo: "Processamento de elástico"}
    }
  });
  data.usuarios = await db.Usuario.findAll();
  data.lotes = await db.LoteMateriaPrima.findAll({
    order: [['id', 'DESC']],
    include: [
      {model: db.MateriaPrima, where: {tipo: "Elástico manufaturado"}}, 
      {model: db.TransacaoMateriaPrima, as: "PrimeiraTransacao", include: [db.EntidadeExterna, db.Usuario]}
    ]
  });

  res.render("forms/processamentoElastico", data);
});

router.post('/processamentoElastico', async function(req, res) {
  try {
    var loteRoloElastico = await db.LoteMateriaPrima.findOne({
      where: {id: req.body.LoteRoloElasticoId}
    });
    // Retira rolos de elástico
    var transacaoElastico = await loteRoloElastico.updateWithTransaction({
      sinal: "saída",
      qtd: req.body.qtd_usado,
      tipo: "Operação interna",
      data: req.body.data,
      observacaco: "",
      EntidadeExternaId: req.body.EntidadeExternaId,
      UsuarioId: req.body.UsuarioId,
      allowUndo: false
    });

    if(transacaoElastico){
      // Para fazer elásticos manufaturados
      db.LoteMateriaPrima.createWithTransaction({
        qtd: req.body.qtd_produzido,
        MateriaPrimaId: req.body.MateriaPrimaId,
        tipo: "Operação interna",
        data: req.body.data,
        observacaco: "",
        EntidadeExternaId: req.body.EntidadeExternaId,
        UsuarioId: req.body.UsuarioId
      });

      res.redirect("processamentoElastico");
    }
    else {
      res.send("Falha ao realizar a transação!");
    }

    
  } 
  catch(e){
    res.send(e);
  }
});

router.get('/processamentoPETG', async function(req, res) {
  data = {}
  data.lotePETG = await db.LoteMateriaPrima.findAll({
    include: {model: db.MateriaPrima, where: {tipo: "PETG"}}
  });
  data.visores = await db.MateriaPrima.findAll({
    where: {tipo: "Visor manufaturado"}
  });
  data.entidadesExternas = await db.EntidadeExterna.findAll({
    include: {
      model: db.EntidadeProcesso,
      where: {processo: "Processamento de PETG"}
    }
  });
  data.processamentos = await db.ProcessamentoPETG.findAll({
    include: [
      {model: db.TransacaoMateriaPrima, as: "TransacaoPETG", include: [db.EntidadeExterna, db.Usuario, {
        model: db.LoteMateriaPrima
      }]},
      {model: db.TransacaoMateriaPrima, as: "TransacaoVisor", include: [db.EntidadeExterna, db.Usuario, {
        model: db.LoteMateriaPrima
      }]}
    ],
    order: [['id', 'DESC']]
  })
  data.usuarios = await db.Usuario.findAll();

  res.render("forms/processamentoPETG", data);
});

router.post('/processamentoPETG', async function(req, res) {
  try {
    var lotePETG = await db.LoteMateriaPrima.findOne({
      where: {id: req.body.LotePETGId}
    });
    // Retira PETG
    var transacaoPETG = await lotePETG.updateWithTransaction({
      sinal: "saída",
      qtd: req.body.qtd_usado,
      tipo: "Operação externa",
      data: req.body.data,
      observacaco: "",
      EntidadeExternaId: req.body.EntidadeExternaId,
      UsuarioId: req.body.UsuarioId,
      allowUndo: false
    })

    if(transacaoPETG){
      db.ProcessamentoPETG.create({
        estado: false,
        TransacaoPETGId: transacaoPETG.id
      });
    }
    else {
      res.send("Falha ao realizar a transação!");
    }

    res.redirect("processamentoPETG");
    
  } 
  catch(e){
    res.send(e);
  }
});

router.post('/processamentoPETG/atualizar', async function(req, res) {
  try {
    var processamentoPETG = await db.ProcessamentoPETG.findOne({
      where: {id: req.body.ProcessamentoPETGId},
      include: [{model: db.TransacaoMateriaPrima, as: 'TransacaoPETG'}]
    });

    // Cria Visor
    var transacaoVisor = await db.LoteMateriaPrima.createWithTransaction({
      qtd: parseFloat(req.body.qtd_produzido),
      MateriaPrimaId: req.body.MateriaPrimaId,
      tipo: "Operação externa",
      data: req.body.data,
      observacaco: "",
      EntidadeExternaId: processamentoPETG.TransacaoPETG.EntidadeExternaId, 
      UsuarioId: req.body.UsuarioId
    })

    if(transacaoVisor){
      processamentoPETG.TransacaoVisorId = transacaoVisor.id;
      processamentoPETG.estado = true;
      processamentoPETG.save();
    }

    res.redirect("../processamentoPETG");
    
  } 
  catch(e){
    res.send(e);
  }
});

router.get('/pacoteFinal', async function(req, res) {
  var data = {};
  data.usuarios = await db.Usuario.findAll();
  data.lotes = await db.Lote.findAll();
  data.pacotes = await db.PacoteFinal.findAll({
    include: db.PacoteFinalLote,
    order: [['id', 'DESC'], [db.PacoteFinalLote, 'LoteId', 'ASC']]
  });
  res.render("forms/pacoteFinal", data);
});

router.post('/pacoteFinal', async function(req, res) {
  var pacoteFinal = await db.PacoteFinal.create({
    qtd_faceshields: parseInt(req.body.qtd_faceshields),
    data: moment(req.body.data).toISOString(),
    UsuarioId: parseInt(req.body.UsuarioId)
  });

  req.body['LoteId[]'].forEach(l => {
    db.PacoteFinalLote.create({
      LoteId: parseInt(l),
      PacoteFinalId: parseInt(pacoteFinal.id)
    })
  });

  res.redirect("pacoteFinal");
});

router.get('/pacoteFinal/delete/:id', function(req, res) {
  db.PacoteFinalLote.destroy({
    where: {id: parseInt(req.params.id)}
  }).then(r => res.redirect("../../pacoteFinal"));
});

router.post('/pacoteFinal/add', function(req, res) {
  console.log(req.body);
  db.PacoteFinalLote.create({
    LoteId: parseInt(req.body.LoteId),
    PacoteFinalId: parseInt(req.body.PacoteFinalId)
  }).then(r => res.redirect("../pacoteFinal"));
});

router.get('/entregaFinal', async function(req, res) {
  data = {}
  data.clientes = await db.Cliente.findAll({attributes:['id', 'nome']});
  data.pacoteFinal = await db.PacoteFinal.findAll({attributes:['id'], order:[['id', 'desc']]});
  data.usuarios = await db.Usuario.findAll({attributes:['id', 'nome']});
 
  res.render("forms/entregaFinal", data);
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
