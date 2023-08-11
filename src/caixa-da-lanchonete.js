import { cardapio } from './cardapio-de-lanchonete.js';
import { DESCONTO_DINHEIRO, ACRESCIMO_CREDITO } from './constantes-de-calculo.js';

class CaixaDaLanchonete {
    constructor() {
        this.cardapio = cardapio;
        this.descontoDinheiro = DESCONTO_DINHEIRO;
        this.acrescimoCredito = ACRESCIMO_CREDITO;
    }

    calcularValorDaCompra(formaDePagamento, itens) {
        if (itens.length === 0) {
            return 'Não há itens no carrinho de compra!';
        }

        const quantidadeDeItens = {};

        for (const itemInfo of itens) {
            const [codigo, quantidade] = itemInfo.split(',');
            if (!this.cardapio[codigo]) {
                return 'Item inválido!';
            }

            if (parseInt(quantidade) <= 0) {
                return 'Quantidade inválida!';
            }

            quantidadeDeItens[codigo] = (quantidadeDeItens[codigo] || 0) + parseInt(quantidade);
        }

        let valorTotal = 0;

        for (const codigo in quantidadeDeItens) {
            const quantidade = quantidadeDeItens[codigo];
            const valorItem = this.cardapio[codigo].valor;
            valorTotal += quantidade * valorItem;

            if (this.isItemExtra(codigo) && !quantidadeDeItens[this.getPrincipalItemCodigo(codigo)]) {
                return 'Item extra não pode ser pedido sem o principal';
            }
        }

        if (formaDePagamento === 'dinheiro') {
            valorTotal -= valorTotal * this.descontoDinheiro;
        } else if (formaDePagamento === 'credito') {
            valorTotal += valorTotal * this.acrescimoCredito;
        } else if (formaDePagamento !== 'debito') {
            return 'Forma de pagamento inválida!';
        }

        return `R$ ${valorTotal.toFixed(2).replace('.', ',')}`;
    }

    isItemExtra(codigo) {
        return codigo === 'chantily' || codigo === 'queijo';
    }

    getPrincipalItemCodigo(codigoExtra) {
        if (codigoExtra === 'chantily') return 'cafe';
        if (codigoExtra === 'queijo') return 'sanduiche';
        return null;
    }
}

export { CaixaDaLanchonete };
