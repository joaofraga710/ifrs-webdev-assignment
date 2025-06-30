let rendaMensal = 0;
let saldoAtual = 0;

const rendaValor = document.getElementById("rendaValor");
const addRendaBtn = document.getElementById("addRenda");
const saldoAtualElem = document.getElementById("saldoAtual");
const addTransacaoBtn = document.getElementById("addTransacao");
const valorTransacao = document.getElementById("valorTransacao");
const descricaoTransacao = document.getElementById("descricaoTransacao");
const tipoTransacao = document.getElementById("desepareceita");
const dataTransacao = document.getElementById("data");
const classeTransacao = document.getElementById("classe");
const listaTransacoes = document.getElementById("listaTransacoes");
const classeContainer = document.getElementById("classeContainer");

function esconderTodosSelectsClasse() {
  const ids = [
    'classeContas', 'classeAlimentacao', 'classeTransporte', 'classeSaude',
    'classeEducacao', 'classeLazer', 'classeVestuario', 'classeOutros'
  ];
  ids.forEach(id => {
    document.getElementById(id).style.display = 'none';
  });
}

function mostrarSelectClasse(classe) {
  const idMap = {
    contas: 'classeContas',
    alimentacao: 'classeAlimentacao',
    transporte: 'classeTransporte',
    saude: 'classeSaude',
    educacao: 'classeEducacao',
    lazer: 'classeLazer',
    vestuario: 'classeVestuario',
    pessoal: 'classeOutros'
  };
  if (idMap[classe]) {
    document.getElementById(idMap[classe]).style.display = 'block';
  }
}

function obterTipoClasse(classe) {
  const selectMap = {
    contas: 'selectContas',
    alimentacao: 'selectAlimentacao',
    transporte: 'selectTransporte',
    saude: 'selectSaude',
    educacao: 'selectEducacao',
    lazer: 'selectLazer',
    vestuario: 'selectVestuario',
    pessoal: 'selectOutros'
  };
  const selectId = selectMap[classe];
  if (!selectId) return '';
  const select = document.getElementById(selectId);
  return select?.options[select.selectedIndex]?.text || '';
}

function salvarTransacaoLocalStorage(transacao) {
  const transacoes = JSON.parse(localStorage.getItem('transacoes')) || [];
  transacoes.push(transacao);
  localStorage.setItem('transacoes', JSON.stringify(transacoes));
}

function atualizarListaTransacoes() {
  listaTransacoes.innerHTML = '';
  const transacoes = JSON.parse(localStorage.getItem('transacoes')) || [];

  transacoes.forEach(t => {
    const item = document.createElement("li");
    let texto = `${t.data} - R$${t.valor.toFixed(2)} - ${t.descricao} - ${t.tipoClasse || ''} - ${t.tipo}`;
    if (t.classe) texto += ` - ${t.classe}`;
    if (typeof t.saldo !== 'undefined') texto += ` | Saldo: R$ ${t.saldo.toFixed(2)}`;
    item.textContent = texto;
    item.classList.add(t.tipo);
    listaTransacoes.appendChild(item);
  });
}

tipoTransacao.addEventListener("change", () => {
  classeContainer.style.display = tipoTransacao.value === "despesa" ? "block" : "none";
  esconderTodosSelectsClasse();
});

classeTransacao.addEventListener("change", () => {
  esconderTodosSelectsClasse();
  mostrarSelectClasse(classeTransacao.value);
});

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

  localStorage.setItem('rendaMensal', rendaMensal);
  localStorage.setItem('saldoAtual', saldoAtual);
});

addTransacaoBtn.addEventListener("click", () => {
  const valor = parseFloat(valorTransacao.value);
  const descricao = descricaoTransacao.value.trim();
  const data = dataTransacao.value;
  const tipo = tipoTransacao.value;
  const classe = classeTransacao.options[classeTransacao.selectedIndex]?.text || '';
  const tipoClasse = obterTipoClasse(classeTransacao.value);

  if (!valor || !descricao || !data || tipo !== 'despesa' || !classeTransacao.value) {
    alert("Informe um valor, uma descrição, uma data e uma classe de despesa.");
    return;
  }

  saldoAtual -= valor;

  const transacao = {
    valor,
    descricao,
    data,
    tipo,
    classe,
    tipoClasse,
    saldo: saldoAtual
  };

  salvarTransacaoLocalStorage(transacao);
  atualizarListaTransacoes();
  saldoAtualElem.textContent = `Saldo atual: R$ ${saldoAtual.toFixed(2)}`;

  valorTransacao.value = '';
  descricaoTransacao.value = '';
  tipoTransacao.value = '';
  classeTransacao.value = '';
  classeContainer.style.display = "none";
  esconderTodosSelectsClasse();

  localStorage.setItem('saldoAtual', saldoAtual);
});

classeContainer.style.display = 'none';
esconderTodosSelectsClasse();
atualizarListaTransacoes();
