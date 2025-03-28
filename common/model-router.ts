import {Router} from './router'
import * as mongoose from 'mongoose'

import {NotFoundError} from 'restify-errors'

export abstract class ModelRouter<D extends mongoose.Document> extends Router {

    basePath: string
    pageSize: number = 999999999

    constructor(protected model: mongoose.Model<D>){
        super()
        this.basePath = `/${model.collection.name}`
    }


    envelope(document: any): any {

        console.log('Entrou Envelope')
        let resource = Object.assign({_links:{}}, document.toJSON())
        resource._links.self = `${this.basePath}/${resource._id}`
        return resource
    }


    envelopeAll(documents: any[], options: any = {}): any {

        console.log('Entrou EnvelopeAll')
        const resource: any ={
            _links: {
                self:`${options.url}`
            },
            items: documents
        }
        if(options.page && options.count && options.pageSize){
            if(options.page > 1){

                resource._links.previous= `${this.basePath}?_page=${options.page-1}`
            }
            const remaining = options.count - (options.page * options.pageSize)
            if(remaining > 0){
                resource._links.next= `${this.basePath}?_page=${options.page+1}`
            }
        }
        return resource
    }

    validateId = (req, resp, next) => {

        console.log('Entrou Validate ID')
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            next(new NotFoundError('Document not found'));
        }else{
            next()
        }
    }

    findAll = (req, resp, next) => {

        console.log('Entrou FindAll')
        let page = parseInt(req.query._page || 1)
        page = page > 0 ? page : 1

        const skip = (page - 1) * this.pageSize

        this.model.count({}).exec()
        .then(count=>this.model.find()
        .skip(skip)
        .limit(this.pageSize)
        .then(this.renderAll(resp, next, {page, count, pageSize: this.pageSize, url: req.url})))
        .catch(next)
    }

    findById = (req, resp, next) => {

        console.log('Entrou FindByID')
        this.model.findById(req.params.id)
        .then(this.render(resp, next))
        .catch(next)
    }
    
    save =  (req, resp, next) => {
        let document = new this.model(req.body);
        document.save()
        .then(this.render(resp, next))
        .catch(next)
    }

    replace = (req, resp, next) => {

        console.log('Entrou Replace')
        const options = {runValidators:true, overwrite: true}
        this.model.update({_id:req.params.id}, req.body, options).exec().then(result=>{
            if(result.n){

               return this.model.findById(req.params.id)
            
            }else{
                throw new NotFoundError('Documento não encontrado')
            
            }
        }).then(this.render(resp, next))
        .catch(next)
        
    }
    update = (req, resp, next) => {

        console.log('Entrou Update')
        const options = { runValidators: true, new: true }
        this.model.findByIdAndUpdate(req.params.id, req.body, options)
        .then(this.render(resp, next))
        .catch(next)
        
    }

    delete = (req, resp, next) => {
        
        console.log('Entrou Delete')
        this.model.findByIdAndDelete(req.params.id).then((cmdResult:any)=>{
            console.log(cmdResult)
            if(cmdResult != null){
                resp.send(204)
            }else{
                throw new NotFoundError('Documento não encontrado')
            
            }
            return next()

        }).catch(next)
    }
}