angular.module("novel2music").controller('termCtrl', function termCtrl($scope, common, crudPrvd, resultPrvd, SharedStateService) {
    var vm = this;

    vm.init = function(id, user) {
        vm.novel = {};
        vm.user = {};
        vm.music = [];
        vm.term = [];
        vm.datas = [];
        vm.check_term = [];
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
                var row = vm.music.filter(function(item, index){
                    if(item.id == response.data.datas[0].music_id) return true;
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

    vm.nextParagraph = function(id) {
        if(vm.paragraph_num < vm.novel.paragraph.length) {
            var data = {paragraph_id: vm.paragraph_num, term_id: vm.check_term};
            vm.datas.push(data);

            vm.check_term = [];
            vm.paragraph_num++;
            console.dir(vm.datas);

            var urls = [];
            urls.push(common.API_HOST + common.API_TERM +"?novel_id=" +id+ "&paragraph_id=" +vm.paragraph_num);
            urls.push(common.API_HOST + common.API_RELATION_NOVEL +"?novel_id=" +id+ "&paragraph_id=" +vm.paragraph_num+ "&user_id=" +vm.user.id);
            var promise = crudPrvd.getArray(urls);
            var successCallback = function(response) {
                vm.term = response[0].data.datas;
                var row = vm.music.filter(function(item, index){
                    if(item.id == response[1].data.datas[0].music_id) return true;
                });
                //console.dir(response.data.datas[0]);
                vm.now_playing = row[0].file_path;
            };
            var errorCallback = function(response) {
                consle.dir(response);
            };
            promise.then(successCallback, errorCallback);
        } else {
            vm.is_confirm = true;
        }
    };
});