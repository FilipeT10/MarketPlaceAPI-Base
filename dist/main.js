"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pedidos_router_1 = require("./routes/pedidos/pedidos.router");
const tipopagamento_router_1 = require("./routes/tipopagamento/tipopagamento.router");
const subcategorias_router_1 = require("./routes/subcategorias/subcategorias.router");
const server_1 = require("./server/server");
const users_router_1 = require("./routes/users/users.router");
const main_router_1 = require("./main.router");
const lojas_router_1 = require("./routes/lojas/lojas.router");
const aplications_router_1 = require("./routes/aplications/aplications.router");
const categorias_router_1 = require("./routes/categorias/categorias.router");
const produtos_router_1 = require("./routes/produtos/produtos.router");
const server = new server_1.Server();
server.bootstrap([
    main_router_1.mainRouter,
    users_router_1.usersRouter,
    lojas_router_1.lojasRouter,
    aplications_router_1.aplicationsRouter,
    produtos_router_1.produtosRouter,
    categorias_router_1.categoriasRouter,
    subcategorias_router_1.subcategoriasRouter,
    tipopagamento_router_1.tipoPagamentoRouter,
    pedidos_router_1.pedidosRouter
]).then(server => {
    console.log('Server is listening on:', server.application.address());
}).catch(error => {
    console.log('Server failed to start');
    console.error(error);
    process.exit(1);
});
