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
    demanda: req.body.demanda,
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

router.get('/loteMateriaPrima', function(req, res) {
  res.render("forms/loteMateriaPrima");
});

router.get('/loteImpressao', function(req, res) {
  res.render("forms/loteImpressao");
});

router.get('/loteRaspagem', function(req, res) {
  res.render("forms/loteRaspagem");
});

router.get('/falhasRaspagem', function(req, res) {
  res.render("forms/falhasRaspagem");
});

router.get('/loteCorteVisor', function(req, res) {
  res.render("forms/loteCorteVisor");
});

router.get('/loteCorteElastico', function(req, res) {
  res.render("forms/loteCorteElastico");
});

router.get('/loteMontagem', function(req, res) {
  res.render("forms/loteMontagem");
});

router.get('/loteEmbalagemPrimaria', function(req, res) {
  res.render("forms/loteEmbalagemPrimaria");
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
