// Página do convite (AJ-04 parte 2). Lê SÓ o fragmento (location.hash): ele nunca vai ao servidor.
// Valida só o prefixo OEA1 e os caracteres; não decodifica o convite (quem valida é o app).
/* global location, document */
'use strict';
(function () {
  var PREFIXO = 'OEA1.';
  var MAX = 4096;
  var bruto = '';
  try {
    bruto = decodeURIComponent((location.hash || '').slice(1)).trim();
  } catch {
    bruto = '';
  }
  var valido = bruto.length > PREFIXO.length && bruto.length <= MAX && bruto.indexOf(PREFIXO) === 0 && /^[A-Za-z0-9._-]+$/.test(bruto);

  function mostrar(id) {
    document.getElementById(id).hidden = false;
  }

  // Ó Eu Aqui! só existe para Android por enquanto: no iPhone/iPad, explica e dá a alternativa (placa + ponto pelo WhatsApp).
  var ua = navigator.userAgent || '';
  var ehApple = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  if (ehApple) {
    mostrar('iphone');
    return;
  }

  if (!valido) {
    mostrar('invalido');
    return;
  }

  mostrar('convite');
  var abrir = document.getElementById('abrir');
  var copiar = document.getElementById('copiar');
  var campo = document.getElementById('codigo');
  var status = document.getElementById('status');
  abrir.setAttribute('href', 'oeuaqui://e#' + bruto);
  campo.value = bruto;

  function avisar(texto, erro) {
    status.textContent = texto;
    status.className = erro ? 'status erro' : 'status';
  }

  function copiarAntigo() {
    campo.focus();
    campo.select();
    campo.setSelectionRange(0, campo.value.length);
    try {
      return document.execCommand('copy');
    } catch {
      return false;
    }
  }

  copiar.addEventListener('click', function () {
    var ok = function () {
      avisar('Código copiado. Agora abra o app Ó Eu Aqui!', false);
    };
    var falhou = function () {
      if (copiarAntigo()) ok();
      else avisar('Não deu para copiar. Toque no código abaixo, selecione tudo e copie.', true);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(bruto).then(ok, falhou);
    else falhou();
  });
})();
