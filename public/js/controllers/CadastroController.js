angular.module('arrumaqui')

.controller('CadastroController', function($scope, CadastroService, VerificaEmailService, $location) {

    $scope.usuario = new CadastroService();

    $scope.servicosOfertados = [
        { nome: "Pedreiro(a)", ticked: false },
        { nome: "Marceneiro(a)", ticked: false },
        { nome: "Artesã(o)", ticked: false },
        { nome: "Encanador(a)", ticked: false },
        { nome: "Eletricista", ticked: false },
        { nome: "Diarista", ticked: false },
        { nome: "Técnico Informática", ticked: false },
        { nome: "Mecânico(a)", ticked: false }
    ];

    $scope.localLang = {
        selectAll: "Todos",
        selectNone: "Nenhum",
        reset: "Limpar",
        search: "Buscar...",
        nothingSelected: "Nenhum selecionado" //default-label is deprecated and replaced with this.
    }

    $scope.cadastrar = () => {
        $scope.usuario.$save()

        .then(() => {
                $scope.mensagem = { texto: "Salvo com sucesso" };
                alert("Salvo com sucesso!");
                $location.path("/profissionais");
            })
            .catch((erro) => {
                alert("Não foi possível salvar");
                $scope.mensagem = { texto: "Não foi possível salvar" };
            });
    }

    app.directive('passwordVerify', function() {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function(scope, elem, attrs, ngModel) {
                ngModel.$validators.myPwdInvalid = function(modelValue, viewValue) {
                    return viewValue === scope.$eval(attrs.passwordVerify);
                };
            }
        };
    });
});