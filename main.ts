import { pedidosRouter } from './routes/pedidos/pedidos.router';
import { tipoPagamentoRouter } from './routes/tipopagamento/tipopagamento.router';
import { subcategoriasRouter } from './routes/subcategorias/subcategorias.router';
import {Server} from './server/server'
import {usersRouter} from './routes/users/users.router'
import { mainRouter } from './main.router'
import { lojasRouter } from './routes/lojas/lojas.router'
import { aplicationsRouter } from './routes/aplications/aplications.router'
import { categoriasRouter} from './routes/categorias/categorias.router'
import { produtosRouter} from './routes/produtos/produtos.router'
import { cuponsRouter } from './routes/cupons/cupons.router';
const server = new Server()

server.bootstrap([
    mainRouter,
    usersRouter,
    lojasRouter,
    aplicationsRouter,
    produtosRouter,
    categoriasRouter,
    subcategoriasRouter,
    tipoPagamentoRouter,
    pedidosRouter,
    cuponsRouter
]).then(server =>{
    console.log('Server is listening on:', server.application.address());
}).catch(error =>{
    console.log('Server failed to start');
    console.error(error)
    process.exit(1)
})
