//Rota para usuarios
module.exports = function (app) {

    let controller = app.controllers.usuarios;

    app.route('/api/usuarios/getEmail/:email')
        .post(controller.autenticaUsuario)
        .get(controller.obtemUsuarioComEmail)

    app.route('/api/usuarios/email')
        .post(controller.autenticaUsuario);

    app.route('/api/usuarios/:id')
        .get(controller.obtemUsuarioPorId)
        .post(controller.atualizaUsuarioPorId);

    app.route('/api/login')
        .post(controller.autenticaLogin);
}
