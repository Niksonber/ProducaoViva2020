var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.get('/usuario', function(req, res) {
  db.Usuario.findAll().then(r => res.render("forms/usuario", {usuarios: r}));
});

router.post('/usuario', function(req, res) {
  db.Usuario.create({
    nome: req.body.nome
  })
  .then(r => res.redirect("usuario"));
});

router.get('/cliente', function(req, res) {
  db.Cliente.findAll().then(r => res.render("forms/cliente", {clientes: r}));
});

router.post('/cliente', function(req, res) {
  db.Cliente.create({
    nome: req.body.nome,
    demanda: parseInt(req.body.demanda),
    contato: req.body.contato
  })
  .then(r => res.redirect("cliente"));
});

router.get('/entidadeExterna', function(req, res) {
  db.EntidadeExterna.findAll().then(r => res.render("forms/entidadeExterna", {entidades: r}));
});

router.post('/entidadeExterna', function(req, res) {
  db.EntidadeExterna.create({
    nome: req.body.nome
  })
  .then(r => res.redirect("entidadeExterna"));
});

router.get('/materiaPrima', function(req, res) {
  db.MateriaPrima.findAll().then(r => res.render("forms/materiaPrima", {materiasprimas: r}));
});

router.post('/materiaPrima', function(req, res) {
  db.MateriaPrima.create({
    nome: req.body.nome,
    tipo: req.body.tipo,
    descricao: req.body.descricao,
    qtd_atual: 0
  })
  .then(r => res.redirect("materiaPrima"));
});

router.get('/loteMateriaPrima', async function(req, res) {
  var data = {};
  data.materiasPrimas = await db.MateriaPrima.findAll();
  data.entidadesExternas = await db.EntidadeExterna.findAll();
  data.usuarios = await db.Usuario.findAll();
  data.lotes = await db.LoteMateriaPrima.findAll({
    include: [
      db.MateriaPrima, 
      {model: db.TransacaoMateriaPrima, as: "PrimeiraTransacao", include: [db.EntidadeExterna, db.Usuario]}
    ]
  });
  res.render("forms/loteMateriaPrima", data);
});

router.post('/loteMateriaPrima', async function(req, res) {
  try {
    var qtd = req.body.qtd;
    var lote = await db.LoteMateriaPrima.create({
      MateriaPrimaId: req.body.MateriaPrimaId,
      PrimeiraTransacaoId: 0,
      qtd_atual: parseFloat(qtd)
    });
    var materiaPrima = await lote.getMateriaPrima();
    materiaPrima.qtd_atual += parseFloat(qtd);
    materiaPrima.save();
    var transacao = await db.TransacaoMateriaPrima.create({
      qtd: parseFloat(qtd),
      tipo: req.body.tipo,
      data: moment(req.body.data).toISOString(),
      observacao: req.body.observacao,
      LoteMateriaPrimaId: lote.id,
      EntidadeExternaId: req.body.EntidadeExternaId,
      UsuarioId: req.body.UsuarioId
    });
    lote.PrimeiraTransacaoId = transacao.id;
    lote.save();
    res.redirect("loteMateriaPrima");
  }
  catch(e){
    res.send(e);
  }
});

router.get('/loteImpressao', async function(req, res) {
  data = {}
  data.usuario = await db.Usuario.findAll({attributes:['Id', 'nome']});
  res.render("forms/loteImpressao", data);
});

router.get('/loteRaspagem', async function(req, res) {
  data = {}
  data.loteImpressao = await db.LoteImpressao.findAll({attributes:['Id']});
  res.render("forms/loteRaspagem", data);
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
  data.loteMontagem = await db.LoteMontagem.findAll({attributes:['id']});

  res.render("forms/loteEmbalagemPrimaria", data);
});

router.get('/pacoteFinal', async function(req, res) {
  data = {}
  data.loteEmbalagemPrimaria = await db.LoteEmbalagemPrimaria.findAll({attributes:['id']});
  data.pacoteFinal = await db.PacoteFinal.findOne({attributes:['id'], order:[['id', 'desc']]});
  console.log(data.pacoteFinal.id)
  
  res.render("forms/pacoteFinal", data);
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
