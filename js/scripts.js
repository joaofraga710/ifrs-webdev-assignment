let rendaMensal = 0;
let saldoAtual = 0;

const rendaValor = document.getElementById("rendaValor");
const addRendaBtn = document.getElementById("addRenda");
const saldoAtualElem = document.getElementById("saldoAtual");
const addTransacaoBtn = document.getElementById("addTransacao");
const valorTransacao = document.getElementById("valorTransacao");
const descricaoTransacao = document.getElementById("descricaoTransacao");
const tipoTransacao = document.getElementById("desepareceita");
const classeTransacao = document.getElementById("classe");
const listaTransacoes = document.getElementById("listaTransacoes");

addRendaBtn.addEventListener("click", () => {
  const valor = parseFloat(rendaValor.value);
  if (isNaN(valor) || valor <= 0) {
    alert("Informe um valor de renda válido.");
    return;
  }
  rendaMensal = valor;
  saldoAtual = valor;
  saldoAtualElem.textContent = `Saldo atual: R$ ${saldoAtual.toFixed(2)}`;
  rendaValor.value = '';
});

addTransacaoBtn.addEventListener("click", () => {
  const valor = parseFloat(valorTransacao.value);
  const descricao = descricaoTransacao.value.trim();
  const tipo = tipoTransacao.value;
  const classe = classeTransacao.options[classeTransacao.selectedIndex].text;

  if (
    isNaN(valor) ||
    descricao === '' ||
    tipo === '' ||
    classeTransacao.value === ''
  ) {
    alert("Informe um valor, uma descrição, um tipo e uma classe.");
    return;
  }

  if (tipo === "despesa") {
    saldoAtual -= valor;
  } else if (tipo === "receita") {
    saldoAtual += valor;
  } else if (tipo === "economia") {
    saldoAtual -= valor;
  }

  const item = document.createElement("li");
  item.textContent = `${descricao} - R$ ${valor.toFixed(2)} - ${tipo} - ${classe} | Saldo: R$ ${saldoAtual.toFixed(2)}`;
  item.classList.add(tipo);
  listaTransacoes.appendChild(item);

  saldoAtualElem.textContent = `Saldo atual: R$ ${saldoAtual.toFixed(2)}`;

  valorTransacao.value = '';
  descricaoTransacao.value = '';
  tipoTransacao.value = '';
  classeTransacao.value = '';
});