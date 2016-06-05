angular.module("novel2music").controller('explainCtrl', function explainCtrl(common, crudPrvd, resultPrvd) {
    var vm = this;

    vm.init = function() {
        vm.novel = {};
        var url = common.API_HOST + common.API_NOVEL;
        var promise = crudPrvd.get(url);
        var successCallback = function(response) {
            vm.novel = response.data.datas;
        };
        var errorCallback = function(response) {
            console.dir(response);
        };
        promise.then(successCallback, errorCallback);
    };
});