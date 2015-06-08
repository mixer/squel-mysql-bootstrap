# squel-mysql-bootstrap

A simple wrapper around Squel to automatically promisify and attach it to a node-mysql connection.

```js
var bootstrap = require('squel-mysql-bootstrap');
var connection = require('mysql').createConnection();

bootstrap(connection);

connection.select()
    .from('users')
    .where('username = ?', 'connor4312')
    .then(function (results) {
        console.log(results);
    });
```

### API

The following methods are available on the connection to start a query: `select()`, `update()`, `insert()`, `delete()`.

After creating your query, calling `.execute()` returns a promise, or you can call `.then()`, `.catch()`, or `.bind()` to automatically create and call a method on a promise.

## License

This software is MIT licensed, copyright 2015 by Beam LLC.
