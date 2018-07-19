/**
 * Main route rules
 * @param {koa} app - Koa appliacation
 * @param {helpers/passport} passport - Adapted passport module
 * @module routes
 */
module.exports = function routes(app, passport) {
    "use strict";

    const
        co   = require('co'),
        Router = require('koa-router'),
        authed = require('../helpers/authedMiddleware'),
        KoaBody = require('koa-body'),


    // Controllers
        indexController  = require('../controllers/indexController'),
        loginController  = require('../controllers/loginController'),
        goodsController = require('../controllers/goodsController'),
        secureController = require('../controllers/secureController');


    var router = new Router();

    router
        .get('/',          indexController.index)
        .get('/users',     indexController.list)
        .get('/users/:id', indexController.getId)
        .get('/goods/:id', goodsController.get)// 200 - ок, 404 - нет такого товара
        .post('/goods',    KoaBody(), goodsController.post)//201 - добавить товар, 400 - не удалось
        .del('/goods/:id', goodsController.del)//204 - удалось удалить, 400 - не удалось
        .get('/login',     loginController.login)
        .post('/login',
            passport.authenticate('local', {
                successRedirect: '/secure',
                failureRedirect: '/login'
            })
        )
        .get('/logout', co.wrap(function*(ctx) {
            ctx.logout();
            ctx.redirect('/login')
        }))
        .get('/secure', authed, secureController.index);

    app.use(router.routes());
    app.use(router.allowedMethods({
        throw: true,
        notImplemented: () => new Boom.notImplemented(),
        methodNotAllowed: () => new Boom.methodNotAllowed()
    }));
};
