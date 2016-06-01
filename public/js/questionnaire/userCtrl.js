angular.module("novel2music").controller('userCtrl', function userCtrl(common, crudPrvd, resultPrvd) {
    var vm = this;

    vm.init = function() {
        vm.user = {};
        vm.is_confirm = false;
        vm.is_double = false;
    };

    vm.post = function() {
        console.dir(vm.user);
        var url = common.API_HOST + common.API_USER;
        var promise = crudPrvd.post(url, vm.user);
        var successCallback = function(response) {
            var sentence = "ユーザ登録が完了しました";
            resultPrvd.showResult(vm, sentence, '/');
        };
        var errorCallback = function(response) {
            console.dir(response);
            vm.is_double = false;
            var sentence = "ユーザ登録に失敗しました";
            resultPrvd.showFaild(vm, sentence);
        };
        promise.then(successCallback, errorCallback);
    };
});