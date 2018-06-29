var express = require('express');
var load = require('express-load');

module.exports = function() {
    let app = express();

    //Variavel de ambiente acessivel em app.get('port)
    app.set('port', 3000);

    //middleware
    app.use(express.static('./public'));

    //Definindo a engine view EJS
    app.set('view engine', 'ejs');
    app.set('views', './app/views');

    //A função load carrega todos os scripts em model, controllers, routes
    //cwd muda o diretorio padrao
    load('models', { cwd: 'app' })
        .then('controllers')
        .then('routes')
        .into(app);

    return app;
};