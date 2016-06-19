angular.module("novel2music").controller('explainCtrl', function explainCtrl(common, crudPrvd, resultPrvd) {
    var vm = this;

    vm.init = function(user) {
        vm.novel = {};
        vm.user = {};
        vm.answered_novel = [];

        var urls = [];
        urls.push(common.API_HOST + common.API_NOVEL);
        urls.push(common.API_HOST + common.API_USER + "?name=" + user);
        var promise = crudPrvd.getArray(urls);
        var successCallback = function(response) {
            vm.novel = response[0].data.datas;
            vm.user = response[1].data.datas[0];
            var url = common.API_HOST + common.API_RELATION_NOVEL + "?user_id=" + vm.user.id;
            var promise2 = crudPrvd.get(url);
            var successCallback2 = function(response) {
                //console.dir(response);
                vm.answered_novel = response.data.datas;
            };
            var errorCallback2 = function(response) {
                console.dir(response);
            };
            promise2.then(successCallback2, errorCallback2);
        };
        var errorCallback = function(response) {
            console.dir(response);
        };
        promise.then(successCallback, errorCallback);
    };

    vm.isAnswerd = function(novel_id) {
        var row = vm.answered_novel.filter(function(item, index){
            if(item.novel_id == novel_id) return true;
        });
        if(row.length > 0) return true;
        else return false;
    };
});