"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server/server");
const users_router_1 = require("./routes/users/users.router");
const restaurants_router_1 = require("./routes/restaurants/restaurants.router");
const reviews_router_1 = require("./routes/reviews/reviews.router");
const main_router_1 = require("./main.router");
const lojas_router_1 = require("./routes/lojas/lojas.router");
const aplications_router_1 = require("./routes/aplications/aplications.router");
const categorias_router_1 = require("./routes/categorias/categorias.router");
const server = new server_1.Server();
server.bootstrap([
    main_router_1.mainRouter,
    users_router_1.usersRouter,
    restaurants_router_1.restaurantsRouter,
    reviews_router_1.reviewsRouter,
    lojas_router_1.lojasRouter,
    aplications_router_1.aplicationsRouter,
    categorias_router_1.categoriasRouter
]).then(server => {
    console.log('Server is listening on:', server.application.address());
}).catch(error => {
    console.log('Server failed to start');
    console.error(error);
    process.exit(1);
});
