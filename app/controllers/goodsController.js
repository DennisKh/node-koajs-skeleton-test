const goMan = require('../managers/goodsManager'),
      Memcached = require('memcached'),
      memcached = new Memcached('localhost:11211');

module.exports = {
    get: async (ctx, next) => {
        try {
            ctx.body = await goMan.getById(ctx.params.id);
            ctx.status = 200;
            await next();
        } catch (err) {
            ctx.status = err.statusCode || err.status || 404;
            ctx.body = {
                message: err.message
            };
        }
    },

    post: async (ctx, next) => {
        var data = ctx.request.body;
        if (typeof data === 'object') {
            data = JSON.stringify(data)
        }
        try {                  
            ctx.body = await goMan.setNewItem(data);
            ctx.status = 201;
            await next();
        } catch (err) {
            ctx.status = err.statusCode || err.status || 400;
            ctx.body = {
                message: err.message
            };
        }
    },

    del: async (ctx, next) => {
        try {
            ctx.body = await goMan.removeItem(ctx.params.id);
            ctx.status = 200;
            await next();
        } catch (err) {
            ctx.status = err.statusCode || err.status || 404;
            ctx.body = {
                message: err.message
            };
        }
    }
};
