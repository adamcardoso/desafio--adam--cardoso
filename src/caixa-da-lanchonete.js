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

        const quantidadeDeItens = this.contarItens(itens);

        if (this.itemInvalido(quantidadeDeItens)) {
            return 'Item inválido!';
        }

        if (this.quantidadeInvalida(quantidadeDeItens)) {
            return 'Quantidade inválida!';
        }

        let valorTotal = 0;
        let hasPrincipal = false;

        for (const codigo in quantidadeDeItens) {
            const quantidade = quantidadeDeItens[codigo];
            const valorItem = this.cardapio[codigo].valor;
            valorTotal += quantidade * valorItem;

            if (this.isItemExtra(codigo)) {
                const principalCodigo = this.getPrincipalItemCodigo(codigo);
                if (!quantidadeDeItens[principalCodigo]) {
                    return 'Item extra não pode ser pedido sem o principal';
                }
            } else {
                hasPrincipal = true;
            }
        }

        if (!hasPrincipal) {
            return 'Não há itens principais no carrinho de compra!';
        }

        return this.aplicarDescontoOuAcrescimo(valorTotal, formaDePagamento);
    }

    contarItens(itens) {
        const quantidadeDeItens = {};

        for (const itemInfo of itens) {
            const [codigo, quantidade] = itemInfo.split(',');
            quantidadeDeItens[codigo] = (quantidadeDeItens[codigo] || 0) + parseInt(quantidade);
        }

        return quantidadeDeItens;
    }

    itemInvalido(quantidadeDeItens) {
        return Object.keys(quantidadeDeItens).some(codigo => !this.cardapio[codigo]);
    }

    quantidadeInvalida(quantidadeDeItens) {
        return Object.values(quantidadeDeItens).some(quantidade => quantidade <= 0);
    }

    aplicarDescontoOuAcrescimo(valorTotal, formaDePagamento) {
        switch (formaDePagamento) {
            case 'dinheiro':
                valorTotal -= valorTotal * this.descontoDinheiro;
                break;
            case 'credito':
                valorTotal += valorTotal * this.acrescimoCredito;
                break;
            case 'debito':
                break;
            default:
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
