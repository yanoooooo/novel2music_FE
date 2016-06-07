angular.module("novel2music").controller('termCtrl', function termCtrl($scope, common, crudPrvd, resultPrvd, SharedStateService) {
    var vm = this;

    vm.init = function(id, user) {
        vm.novel = {};
        vm.user = {};
        vm.music = [];
        vm.term = [];
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
        var row = vm.check_term.filter(function(item, index){
            if(item == id) return true;
        });
        if(row.length > 0) {
            //delete vm.check_term[row[0]];
        } else {
            vm.check_term.push(id);
        }
    };

    vm.nextParagraph = function() {
        console.dir(vm.check_term);
    };
});