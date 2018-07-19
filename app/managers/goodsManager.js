const Memcached = require('memcached'),
           co   = require('co'),
      memcached = new Memcached('localhost:11211');

module.exports = {

    getById: function getIdFromMemcache(id) {
        return new Promise((resolve, reject) => {
            memcached.get(id, function (err, data) {
              try {
                resolve(JSON.parse(data));
              } catch (e) {
                resolve('Error 404' + "\n" +'Not Found');
                console.log('Ошибка ' + e.name + " : " + e.message + "\n" + e.stack)
              }
            })
        });
    },


    setNewItem: function setNewItemToMemcache(data) {
      return new Promise((resolve, reject) => {
            console.log(data);
        try {
          let idx = Date.now();
          memcached.set(idx, data, 200, function (err) {
            if (err) {
              console.log('Error 400' + "\n" +'Not Found');
            }
          });
            resolve('Status 200 (OK): ID = ' + idx + "\n")
            return module.exports.getById(idx);

        } catch (e) {
            resolve('Error 400' + "\n")
            console.log(e.name + ":" + e.message + "\n" + e.stack);
        }
      });
    },


    removeItem: function removeItemFromMemcache(id) {
        return new Promise((resolve, reject) => {
          try {
            memcached.del(id, function (err) {
              resolve('Status 200 (OK)' + "\n")
            });
          } catch (e) {
            resolve('Error 400' + "\n")
            console.log(e.name + ":" + e.message + "\n" + e.stack);
          }
        });
    }
};
