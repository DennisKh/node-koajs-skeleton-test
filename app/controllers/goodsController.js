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
        var data = [
            {id:0, name: "test0" },
            {id:1, name: "test1" },
            {id:2, name: "test2" }
        ];
        if (typeof data === 'object') {
            data = JSON.stringify(data)
        }
        try {                  //тут має бути ctx.request.body, але в мене проблеми з нодою, тому так
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

    /** Get list of all users DB */
    del: async (ctx, next) => {
        try {
            ctx.body = await goMan.removeItem(ctx.params.id);
            ctx.status = 200;
            await next();
        } catch (err) {
            // will only respond with JSON
            ctx.status = err.statusCode || err.status || 404;
            ctx.body = {
                message: err.message
            };
        }
    }
};
