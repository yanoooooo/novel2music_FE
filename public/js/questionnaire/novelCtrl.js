angular.module("novel2music").controller('novelCtrl', function novelCtrl($scope, common, crudPrvd, resultPrvd, SharedStateService) {
    var vm = this;

    vm.init = function(id) {
        vm.novel = {};
        vm.paragraph_num = 1;

        var url = common.API_HOST + common.API_NOVEL + "?id=" +id;
        var promise = crudPrvd.get(url);
        var successCallback = function(response) {
            vm.novel = response.data.datas[0];
            console.dir(vm.novel);
        };
        var errorCallback = function(response) {
            console.dir(response);
        };
        promise.then(successCallback, errorCallback);
    };

    $scope.$watch(function() {
        return SharedStateService.music_id;
    }, function(){
        vm.music_id = SharedStateService.music_id;
    });
});