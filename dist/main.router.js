"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainRouter = void 0;
const router_1 = require("./common/router");
class MainRouter extends router_1.Router {
    applyRoutes(application) {
        application.get('/', (req, resp, next) => {
            resp.json({
                users: '/users',
                restaurants: '/restaurants',
                reviews: '/reviews',
                lojas: '/lojas',
                aplications: '/aplications'
            });
        });
    }
}
exports.mainRouter = new MainRouter();
