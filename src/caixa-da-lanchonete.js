class CaixaDaLanchonete {

    // Construtor da classe. Inicializa o cardápio, desconto em dinheiro e acréscimo no pagamento com cartão de crédito.
    constructor() {
        // Definindo o cardápio da lanchonete como um objeto.
        this.cardapio = {
            // Definindo os itens disponíveis no cardápio.
            cafe: { descricao: 'Café', valor: 3.00 },
            chantily: { descricao: 'Chantily (extra do Café)', valor: 1.50 },
            suco: { descricao: 'Suco Natural', valor: 6.20 },
            sanduiche: { descricao: 'Sanduíche', valor: 6.50 },
            queijo: { descricao: 'Queijo (extra do Sanduíche)', valor: 2.00 },
            salgado: { descricao: 'Salgado', valor: 7.25 },
            combo1: { descricao: '1 Suco e 1 Sanduíche', valor: 9.50 },
            combo2: { descricao: '1 Café e 1 Sanduíche', valor: 7.50 },
        };

        // Definindo o desconto em dinheiro (5% do valor total).
        this.descontoDinheiro = 0.05;

        // Definindo o acréscimo no pagamento com cartão de crédito (3% do valor total).
        this.acrescimoCredito = 0.03;
    }

    // Método para calcular o valor da compra com base na forma de pagamento e na lista de itens selecionados.
    calcularValorDaCompra(formaDePagamento, itens) {
        // Verifica se a lista de itens está vazia.
        if (itens.length === 0) {
            return 'Não há itens no carrinho de compra!';
        }

        // Inicializa um objeto para rastrear a quantidade de cada item selecionado.
        const quantidadeDeItens = {};

        // Percorre a lista de itens para contar a quantidade de cada item.
        for (const itemInfo of itens) {
            const [codigo, quantidade] = itemInfo.split(',');
            // Verifica se o código do item é válido.
            if (!this.cardapio[codigo]) {
                return 'Item inválido!';
            }

            // Verifica se a quantidade de itens é maior que zero

            if (parseInt(quantidade) <= 0) {
                return 'Quantidade inválida!';
            }

            // Incrementa a quantidade do item no objeto quantidadeDeItens.
            quantidadeDeItens[codigo] = (quantidadeDeItens[codigo] || 0) + parseInt(quantidade);
        }

        // Inicializa o valor total da compra.
        let valorTotal = 0;

        // Itera sobre os códigos de itens no objeto quantidadeDeItens para calcular o valor total.
        for (const codigo in quantidadeDeItens) {
            const quantidade = quantidadeDeItens[codigo];
            const valorItem = this.cardapio[codigo].valor;
            valorTotal += quantidade * valorItem;

            // Verifica se é um item extra sem o item principal correspondente.
            if (this.isItemExtra(codigo) && !quantidadeDeItens[this.getPrincipalItemCodigo(codigo)]) {
                return 'Item extra não pode ser pedido sem o principal';
            }
        }

        // Aplica desconto ou acréscimo com base na forma de pagamento.
        if (formaDePagamento === 'dinheiro') {
            valorTotal -= valorTotal * this.descontoDinheiro;
        } else if (formaDePagamento === 'credito') {
            valorTotal += valorTotal * this.acrescimoCredito;
        } else if (formaDePagamento !== 'debito') {
            return 'Forma de pagamento inválida!';
        }

        // Retorna o valor total da compra formatado como string no formato 'R$ XX,XX'.
        return `R$ ${valorTotal.toFixed(2).replace('.', ',')}`;
    }

    // Verifica se um código de item é considerado um item extra.
    isItemExtra(codigo) {
        return codigo === 'chantily' || codigo === 'queijo';
    }

    // Obtém o código do item principal correspondente a um item extra.
    getPrincipalItemCodigo(codigoExtra) {
        if (codigoExtra === 'chantily') return 'cafe';
        if (codigoExtra === 'queijo') return 'sanduiche';
        return null;
    }
}

export { CaixaDaLanchonete };
