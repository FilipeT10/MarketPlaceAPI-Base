"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jestCli = require("jest-cli");
const server_1 = require("./server/server");
const environment_1 = require("./common/environment");
const users_router_1 = require("./routes/users/users.router");
const reviews_router_1 = require("./routes/reviews/reviews.router");
const restaurants_router_1 = require("./routes/restaurants/restaurants.router");
const user_model_1 = require("./routes/users/user.model");
const reviews_model_1 = require("./routes/reviews/reviews.model");
const restaurants_model_1 = require("./routes/restaurants/restaurants.model");
const lojas_router_1 = require("./routes/lojas/lojas.router");
let server;
const beforeAllTests = () => {
    environment_1.environment.db.url = process.env.DB_URL || 'mongodb://localhost/marketplace-manager-test-db';
    environment_1.environment.server.port = process.env.SERVER_PORT || 3001;
    server = new server_1.Server();
    return server.bootstrap([
        users_router_1.usersRouter,
        reviews_router_1.reviewsRouter,
        restaurants_router_1.restaurantsRouter,
        lojas_router_1.lojasRouter
    ])
        .then(() => user_model_1.User.remove({}).exec())
        .then(() => reviews_model_1.Review.remove({}).exec())
        .then(() => restaurants_model_1.Restaurant.remove({}).exec());
};
const afterAllTests = () => {
    return server.shutdown();
};
beforeAllTests()
    .then(() => jestCli.run())
    .then(() => afterAllTests())
    .catch(console.error);
