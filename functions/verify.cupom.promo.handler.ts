import * as restify from 'restify'
import { Cupom } from '../routes/cupons/cupons.model';
import { Produto } from '../routes/produtos/produtos.model';


export const verifyCupomPromo = () =>{
    
    Cupom.find().then(cupoms => {
        cupoms.forEach((cupom) => {
            if (cupom.ativo) {
                if (new Date(cupom.periodoFinal) <= new Date()) {
                    desativarCupom(cupom.id, cupom.periodoFinal);
                    return
                } else {
                    const tempoRestante = new Date(cupom.periodoFinal) - new Date();
                    //20 dias
                    setTimeout(() => desativarCupom(cupom.id, cupom.periodoFinal), tempoRestante);
                }
            }
        })
    }).catch(() => { });
    
    Produto.find().then(produtos => {
        produtos.forEach((produto) => {
            if (produto.promocao) {
                if (new Date(produto.promocao.periodoFinal) <= new Date()) {
                    removerPromocaoProduto(produto.id, produto.promocao.periodoFinal)
                    return
                } else {
                    const tempoRestante = new Date(produto.promocao.periodoFinal) - new Date();
                    //20 dias
                    setTimeout(() => removerPromocaoProduto(produto.id, produto.promocao.periodoFinal), tempoRestante);
                }
            }
        })
    }).catch(() => {})
}

const desativarCupom = async (id, periodoFinal) => {
    const options = { runValidators: true, new: true }

    Cupom.findByIdAndUpdate(id,  { ativo: false }, options).then(() => {
        console.log("Cupom desativado", periodoFinal, new Date() )
    }).catch(() => console.log("Não foi possível desativar o cupom", periodoFinal, new Date() ))
}

const removerPromocaoProduto = async (id, periodoFinal) => {
    const options = { runValidators: true, new: true }

    Produto.findByIdAndUpdate(id,  { promocao: null }, options).then(() => {
        console.log("Promoção removida do produto", periodoFinal, new Date() )
    }).catch(() => console.log("Não foi possível remover promoção do produto", periodoFinal, new Date() ))
}
