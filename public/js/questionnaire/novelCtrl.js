angular.module("novel2music").controller('novelCtrl', function novelCtrl($scope, common, crudPrvd, resultPrvd, SharedStateService) {
    var vm = this;

    vm.init = function(id) {
        vm.novel = {};
        vm.paragraph_num = 1;
        vm.is_confirm = false;

        var url = common.API_HOST + common.API_NOVEL + "?id=" +id;
        var promise = crudPrvd.get(url);
        var successCallback = function(response) {
            vm.novel = response.data.datas[0];
            //console.dir(vm.novel);
        };
        var errorCallback = function(response) {
            console.dir(response);
        };
        promise.then(successCallback, errorCallback);
    };

    $scope.$watch(function() {
        return SharedStateService.relation_novel_music.music_id;
    }, function(){
        SharedStateService.relation_novel_music.novel_id = vm.novel.id;
        SharedStateService.relation_novel_music.paragraph_id = vm.paragraph_num;
        //vm.relation_novel_music = SharedStateService.relation_novel_music;
    });

    $scope.$watch(function() {
        return SharedStateService.decided;
    }, function(){
        if(SharedStateService.decided) {
            console.log(vm.novel.paragraph.length);
            console.log(vm.paragraph_num);
            if(vm.paragraph_num < vm.novel.paragraph.length) {
                vm.paragraph_num++;
                SharedStateService.decided = false;
            } else {
                console.log("finish");
                vm.is_confirm = true;
                SharedStateService.decided = false;
            }
        }
    });
});