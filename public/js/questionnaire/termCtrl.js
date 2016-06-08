angular.module("novel2music").controller('termCtrl', function termCtrl($scope, common, crudPrvd, resultPrvd, SharedStateService) {
    var vm = this;

    vm.init = function(id, user) {
        vm.novel = {};
        vm.user = {};
        vm.music = [];
        vm.term = [];
        vm.datas = [];
        vm.check_term = [];
        vm.relation_novel = {};
        vm.nowplaying = "";
        vm.paragraph_num = 1;
        vm.is_confirm = false;

        var urls = [];
        urls.push(common.API_HOST + common.API_NOVEL + "?id=" +id);
        urls.push(common.API_HOST + common.API_USER +"?name=" + user);
        urls.push(common.API_HOST + common.API_MUSIC);
        urls.push(common.API_HOST + common.API_TERM +"?novel_id=" +id+ "&paragraph_id=1");
        var promise = crudPrvd.getArray(urls);
        var successCallback = function(response) {
            vm.novel = response[0].data.datas[0];
            vm.user = response[1].data.datas[0];
            vm.music = response[2].data.datas;
            vm.term = response[3].data.datas;

            var url = common.API_HOST + common.API_RELATION_NOVEL +"?novel_id=" +id+ "&paragraph_id=1&user_id=" +vm.user.id;
            var promise2 = crudPrvd.get(url);
            var successCallback2 = function(response) {
                vm.relation_novel = response.data.datas[0];
                var row = vm.music.filter(function(item, index){
                    if(item.id == vm.relation_novel.music_id) return true;
                });
                //console.dir(response.data.datas[0]);
                vm.now_playing = row[0].file_path;
                //console.dir(response);
            };
            var errorCallback2 = function(response) {
                console.dir(response);
            };
            promise2.then(successCallback2, errorCallback2);
            //console.dir(vm.novel);
            //console.dir(vm.user);
        };
        var errorCallback = function(response) {
            console.dir(response);
        };
        promise.then(successCallback, errorCallback);
    };

    vm.clickCheckbox = function(id) {
        var flg = vm.check_term.some(function(v, i) {
            if(v == id) {
                vm.check_term.splice(i, 1);
                return true;
            }
        });
        if(!flg) vm.check_term.push(id);
    };

    vm.return = function(is_final) {
        if(!is_final) {
            vm.paragraph_num--;
        }
        vm.check_term = [];
        vm.datas.pop();
        vm.settingTermandMusic(vm.novel.id);
    };

    vm.nextParagraph = function() {
        var data = {music_id: vm.relation_novel.music_id, term_id: vm.check_term};
        vm.datas.push(data);
        vm.check_term = [];
        if(vm.paragraph_num < vm.novel.paragraph.length) {
            vm.paragraph_num++;
            //console.dir(vm.datas);

            vm.settingTermandMusic(vm.novel.id);
        } else {
            vm.is_confirm = true;
        }
    };

    vm.settingTermandMusic = function(id) {
        var urls = [];
            urls.push(common.API_HOST + common.API_TERM +"?novel_id=" +id+ "&paragraph_id=" +vm.paragraph_num);
            urls.push(common.API_HOST + common.API_RELATION_NOVEL +"?novel_id=" +id+ "&paragraph_id=" +vm.paragraph_num+ "&user_id=" +vm.user.id);
            var promise = crudPrvd.getArray(urls);
            var successCallback = function(response) {
                vm.term = response[0].data.datas;
                vm.relation_novel = response[1].data.datas[0];
                var row = vm.music.filter(function(item, index){
                    if(item.id == vm.relation_novel.music_id) return true;
                });
                //console.dir(response.data.datas[0]);
                vm.now_playing = row[0].file_path;
            };
            var errorCallback = function(response) {
                consle.dir(response);
            };
            promise.then(successCallback, errorCallback);
    };

    vm.post = function() {
        //formatted data
        var formatted_data = [];
        for(var i in vm.datas) {
            for(var j in vm.datas[i].term_id) {
                console.log(vm.datas[i].term_id[j]);
                formatted_data.push({term_id: vm.datas[i].term_id[j], user_id: vm.user.id, music_id: vm.datas[i].music_id});
            }
        }
        console.dir(formatted_data);
        vm.comebackPost(formatted_data, 0);
    };

    vm.comebackPost = function(datas, num) {
        var url = common.API_HOST + common.API_RELATION_TERM;
        var promise = crudPrvd.post(url, datas[num]);
        var successCallback = function(response) {
            num++;
            if(num < datas.length) {
                vm.comebackPost(datas, num);
            } else {
                var sentence = "回答の登録が完了しました";
                resultPrvd.showResult(vm, sentence, '/');
            }
        };
        var errorCallback = function(response) {
            var sentence = "回答の登録に失敗しました";
            resultPrvd.showFaild(vm, sentence);
        };
        promise.then(successCallback, errorCallback);
    };
});