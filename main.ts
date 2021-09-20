import {Server} from './server/server'
import {usersRouter} from './routes/users/users.router'
import {restaurantsRouter} from './routes/restaurants/restaurants.router'
import { reviewsRouter } from './routes/reviews/reviews.router'
import { mainRouter } from './main.router'
import { lojasRouter } from './routes/lojas/lojas.router'
import { aplicationsRouter } from './routes/aplications/aplications.router'
import { categoriasRouter} from './routes/categorias/categorias.router'
import { produtosRouter} from './routes/produtos/produtos.router'

const server = new Server()

server.bootstrap([
    mainRouter,
    usersRouter,
    restaurantsRouter,
    reviewsRouter,
    lojasRouter,
    aplicationsRouter,
    produtosRouter,
    categoriasRouter
]).then(server =>{
    console.log('Server is listening on:', server.application.address());
}).catch(error =>{
    console.log('Server failed to start');
    console.error(error)
    process.exit(1)
})
