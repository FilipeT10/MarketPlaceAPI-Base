import { authorize } from './../../security/authz.handler';
import {ModelRouter} from '../../common/model-router'
import * as restify from 'restify'
import {TipoPagamento} from './tipopagamento.model'
import {NotFoundError} from 'restify-errors'



class TipoPagamentosRouter extends ModelRouter<TipoPagamento> {

    constructor(){
        super(TipoPagamento)
    }
    envelope(document){
        let resource = super.envelope(document)
        return resource
    }

    findById = (req, resp, next) => {
        this.model.findById(req.params.id)
        .then(this.render(resp, next))
        .catch(next)
    }


    applyRoutes(application: restify.Server){
        application.get(`${this.basePath}`, this.findAll)
        application.get(`${this.basePath}/:id`, [this.validateId, this.findById])
        application.post(`${this.basePath}`, [authorize('sysAdminMktPlc'), this.save])
        application.patch(`${this.basePath}/:id`, [this.validateId, authorize('sysAdminMktPlc'), this.update])
      }
}

export const tipoPagamentoRouter = new TipoPagamentosRouter();