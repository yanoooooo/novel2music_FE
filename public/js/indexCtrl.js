angular.module("novel2music").controller('indexCtrl', function userCtrl(common, crudPrvd, resultPrvd) {
    var vm = this;

    vm.init = function() {
        vm.login = {};
        vm.login.id = "0";
        //vm.is_confirm = false;
        //vm.is_double = false;
    };

    vm.post = function() {
        var url = common.API_HOST + common.API_LOGIN +"?name="+ vm.login.name+ "&password=" +vm.login.password;
        var promise = crudPrvd.get(url);
        var successCallback = function(response) {
            //console.dir(response);
            if(response.data.datas.length > 0) {
                vm.login.id = response.data.datas[0].id;
                angular.element('#post_reload').submit();
            }else {
                var sentence = "ユーザ名もしくはパスワードが間違っています";
                resultPrvd.showFaild(vm, sentence);
            }
            //var sentence = "ユーザ登録が完了しました";
            //resultPrvd.showResult(vm, sentence, '/');
        };
        var errorCallback = function(response) {
            console.dir(response);
            //$window.location = "/";
            //vm.is_double = false;
            var sentence = "ユーザ名もしくはパスワードが間違っています";
            resultPrvd.showFaild(vm, sentence);
        };
        promise.then(successCallback, errorCallback);
    };
});