var Bluebird = require('bluebird');
var Squel = require('squel');

module.exports = function (cnx) {
    //
    // Proxy CRUD methods.
    //
    var proxy = ['select', 'update', 'delete', 'insert'];
    proxy.forEach(function (method) {
        cnx[method] = function () {
            var query = Squel[method].apply(Squel, arguments);
            query._cnx = this;
            return query;
        };
    });

    /**
     * Executes the built query and returns a promise that resolves
     * to standard mysql results.
     * @param {Object=} options to be passed into the query options.
     * @return {Promise}
     */
    Squel.cls.QueryBuilder.prototype.execute = function (options) {
        var cnx = this._cnx;
        if (!cnx) {
            throw new Error('Attempted to execute a query not bound to connection.', this);
        }

        // Create an options object to query with.
        var query = this.toParam();
        var arg = { sql: query.text, values: query.values };
        if (options) {
            for (var key in options) {
                arg[key] = options[key];
            }
        }

        // If the connection is promisified, use that.
        if (cnx.queryAsync) {
            return cnx.queryAsync(arg);
        }

        // Otherwise make a promise manually.
        return new Blubird(function (resolve, reject) {
            cnx.query(arg, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    };

    // Bind some additional promise methods for automatic chaining.
    var pm = ['then', 'catch', 'bind'];
    pm.forEach(function (method) {
        Squel.cls.QueryBuilder.prototype[method] = function () {
            var promise = this.execute();
            return promise[method].apply(promise, arguments);
        };
    });
};
