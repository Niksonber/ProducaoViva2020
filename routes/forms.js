var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.get('/usuario', function(req, res) {
  res.render("forms/usuario");
});

router.get('/cliente', function(req, res) {
  res.render("forms/cliente");
});

router.get('/entidadeExterna', function(req, res) {
  res.render("forms/entidadeExterna");
});

router.get('/materiaPrima', function(req, res) {
  res.render("forms/materiaPrima");
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


module.exports = router;
