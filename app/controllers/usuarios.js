//Controller para a entidade usuario
require('dotenv').config();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var ActiveDirectory = require('activedirectory2');
var config = { url: process.env.AD_URL,
               baseDN: process.env.AD_BASEDN,
               username: process.env.AD_BINDUSER,
               password: process.env.AD_BINDPW }

module.exports = function (app) {

    var Usuario = app.models.usuario;
    var controller = {};
    var ad = new ActiveDirectory(config);

    controller.atualizaUsuarioPorId = (req, res) => {
        console.log('API: atualizaUsuarioPorId');
        let _idUsuario = req.params.id;
        let criterio = { "_id": _idUsuario };
        let _nome = req.body.nome;
        let _email = req.body.email;
        let _senha = req.body.senha;
        let _novaSenha = req.body.novaSenha;
        let _novoTelefone = req.body.novoTelefone;
        let _novoWhats = req.body.novoWhatsapp;
        let _novaIdade = req.body.novaIdade;
        let _novosServicos = req.body.novosServicos;

        Usuario.findById(criterio).exec()
            .then(function (usuario) {
                if (!usuario) {
                    res.status(401).json({ success: false, message: 'Usuário não encontrado' });
                } else if (usuario) {

                    if (usuario.contato.email === _email) {
                        bcrypt.compare(_senha, usuario.senha).then(function (passcheck) {
                            if (passcheck) {
                                var hashedPassword = bcrypt.hashSync(_novaSenha, 8);
                                usuario.senha = hashedPassword;

                                if ( _nome !== "") {
                                    usuario.nome = _nome;
                                }
                                if ( _novoWhats !== "") {
                                    usuario.contato.whatsapp = _novoWhats;
                                }

                                if ( _novoTelefone !== ""){
                                    usuario.contato.telefone = _novoTelefone;
                                }

                                if ( _novaIdade > usuario.idade && _novaIdade <= 70){
                                    usuario.idade = _novaIdade;
                                }

                                usuario.servicos = _novosServicos;

                                usuario.save(function (erro, usuario) {
                                    if (erro) {
                                        console.log(erro);
                                        res.status(401).json({ success: false, message: 'Erro ao atualizar senha' });
                                    } else {
                                        res.status(200).json(usuario);
                                    }
                                });
                            } else {
                                res.status(401).json({ success: false, message: 'Senha antiga incorreta' });
                            }
                        });
                    } else {
                        res.status(401).json({ success: false, message: 'Email incorreto' });
                    }
                }
            },
                function (erro) {
                    console.log(erro);
                    res.status(404).json(erro);
                }
            );
    };

    //Função que retorna um usuario pelo email
    controller.obtemUsuarioComEmail = function (req, res) {
        console.log('API: obtemUsuarioComEmail');
        let _emailUsuario = req.params.email;
        let criterio = { "contato.email": _emailUsuario };
        Usuario.find(criterio).exec()
            .then(function (usuario) {
                if (!usuario) throw new Error("Usuário não encontrado");
                res.json(usuario)
                res.status(201);
                console.log(usuario);
            },
                function (erro) {
                    console.log(erro);
                    res.status(404).json(erro);
                }
            );
    };

    //Função que retorna um usuário por id
    controller.obtemUsuarioPorId = function (req, res) {
        console.log('API: obtemUsuarioPorId');
        var _id = req.params.id;
        Usuario.findById(_id).exec()
            .then(
                function (usuario) {
                    if (!usuario) throw new Error("Usuário não encontrado");
                    res.json(usuario)
                },
                function (erro) {
                    console.log(erro);
                    res.status(404).json(erro)
                }
            );
    };

    // Vai mapear a pessoa para uma lista de serviços,
    //já como deve retornar para esta pessoa
    const mapPessoa = (pessoa) => {
        return pessoa.servicos.map(servico => {
            return {
                idPessoa: pessoa._id,
                nomePessoa: pessoa.nome,
                nomeServico: servico.nome,
                email: pessoa.contato.email,
                telefone: pessoa.contato.telefone,
                whatsapp: pessoa.contato.whatsapp
            }
        });
    }

    //Autentica Login
    controller.autenticaLogin = (req, res, next) => {
        console.log('API: autenticaLogin');
        let _user = req.body.email;
        let _pw = req.body.senha

        ad.authenticate(_user, _pw, function(err, auth) {
          if (err) {
            res.status(401).json({ success: false, message: 'Autenticação do Usuário falhou. Usuário não encontrado!' });
            return;
          }

          if (auth) {
              var token = jwt.sign(_user, _pw, {
                exp: 1440
              });
              res.status(200).json({
                success: true,
                message: 'Token criado!!!',
                token: token
              });
            }
          else {
              res.status(401).json({ success: false, message: 'Autenticação do Usuário falhou. ' });
          }
      });
    }

    //Autentica usuario
    controller.autenticaUsuario = (req, res) => {
        console.log('API: autenticaUsuario');
        let _user = req.body.email;
        let _pw = req.body.senha;

        ad.authenticate(_user, _pw, function(err, auth) {
          if (err) {
            console.log('ERROR: '+JSON.stringify(err));
            return;
          }

          if (auth) {
            console.log('Authenticated!');
          }
          else {
            console.log('Authentication failed!');
          }
      });
    };

    return controller;
}
