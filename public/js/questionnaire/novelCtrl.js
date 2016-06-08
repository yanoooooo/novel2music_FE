angular.module("novel2music").controller('novelCtrl', function novelCtrl($scope, common, crudPrvd, resultPrvd, SharedStateService) {
    var vm = this;

    vm.init = function(id) {
        vm.novel = {};
        vm.confirm_datas = [];
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

    vm.return = function(is_final) {
        if(!is_final) {
            vm.paragraph_num--;
        }
        SharedStateService.datas.pop();
    };

    vm.post = function(user) {
        var url = common.API_HOST + common.API_USER +"?name=" + user;
        var promise = crudPrvd.get(url);
        var successCallback = function(response) {
            var user_data = response.data.datas[0];
            //formatted data
            vm.datas = [];
            vm.datas = SharedStateService.datas;
            for(var i in vm.datas) {
                vm.datas[i].user_id = user_data.id;
            }
            vm.comebackPost(vm.datas, 0);
        };
        var errorCallback = function(response) {
            var sentence = "ユーザ情報の取得に失敗しました";
            resultPrvd.showFaild(vm, sentence);
        };
        promise.then(successCallback, errorCallback);
    };

    vm.comebackPost = function(data, num) {
        console.dir(data);
        var url = common.API_HOST + common.API_RELATION_NOVEL;
        var promise = crudPrvd.post(url, data[num]);
        var successCallback = function(response) {
            num++;
            if(num < data.length) {
                vm.comebackPost(data, num);
            } else {
                var sentence = "回答の登録が完了しました";
                resultPrvd.showResult(vm, sentence, '/questionnaire/term/'+vm.novel.id);
            }
        };
        var errorCallback = function(response) {
            var sentence = "回答の登録に失敗しました";
            resultPrvd.showFaild(vm, sentence);
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
            if(vm.paragraph_num < vm.novel.paragraph.length) {
                vm.paragraph_num++;
                SharedStateService.decided = false;
            } else {
                //console.log("finish");
                vm.is_confirm = true;
                SharedStateService.decided = false;
            }
        }
    });
});