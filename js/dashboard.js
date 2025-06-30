function agruparTransacoes(transacoes, tipoFiltro) {
  return transacoes
    .filter(t => t.tipo === tipoFiltro)
    .reduce((acc, t) => {
      const chave = t.classe;
      acc[chave] = (acc[chave] || 0) + t.valor;
      return acc;
    }, {});
}

function agruparDetalhamento(transacoes) {
  return transacoes
    .filter(t => t.tipo === 'despesa')
    .reduce((acc, t) => {
      const chave = `${t.classe} - ${t.tipoClasse || ''}`.replace(/ - $/, '');
      acc[chave] = (acc[chave] || 0) + t.valor;
      return acc;
    }, {});
}

function gerarGraficoPizza(ctx, dados, titulo) {
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(dados),
      datasets: [{
        data: Object.values(dados),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
          '#9966FF', '#FF9F40', '#8BC34A', '#E91E63', '#795548'
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: titulo
        }
      }
    }
  });
}

function gerarGraficoBarraHorizontal(ctx, dados, titulo) {
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(dados),
      datasets: [{
        label: 'Valor (R$)',
        data: Object.values(dados),
        backgroundColor: '#FF6384'
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: titulo
        }
      }
    }
  });
}

function renderizarGraficos(transacoes) {
  const ctxPizza = document.getElementById('graficoPizzaDespesas');
  const ctxBarra = document.getElementById('graficoBarraDespesas');

  const dadosClasse = agruparTransacoes(transacoes, 'despesa');
  const dadosDetalhados = agruparDetalhamento(transacoes);

  if (ctxPizza && Object.keys(dadosClasse).length) {
    gerarGraficoPizza(ctxPizza, dadosClasse, 'Despesas por Classe');
  }

  if (ctxBarra && Object.keys(dadosDetalhados).length) {
    gerarGraficoBarraHorizontal(ctxBarra, dadosDetalhados, 'Detalhamento das Despesas');
  }
}

function exibirTransacoesDashboard(transacoes) {
  const lista = document.getElementById('listaTransacoesDashboard');
  if (!lista) return;

  lista.innerHTML = '';
  transacoes.forEach(t => {
    const item = document.createElement('li');
    let texto = `${t.data} - R$${t.valor.toFixed(2)} - ${t.descricao} - ${t.tipoClasse || ''} - ${t.tipo}`;
    if (t.classe) texto += ` - ${t.classe}`;
    if (typeof t.saldo !== 'undefined') texto += ` | Saldo: R$ ${t.saldo.toFixed(2)}`;
    item.textContent = texto;
    lista.appendChild(item);
  });
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    localStorage.removeItem('transacoes');
    localStorage.removeItem('saldoAtual');
    localStorage.removeItem('rendaMensal');
  }
});

const transacoes = JSON.parse(localStorage.getItem('transacoes')) || [];

renderizarGraficos(transacoes);
exibirTransacoesDashboard(transacoes);
