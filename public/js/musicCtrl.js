angular.module("novel2music").controller('musicCtrl', function musicCtrl(common, crudPrvd) {
    var vm = this;

    vm.init = function() {
        vm.scale = {};
        vm.music = {};
        vm.now_playing = "";
        var url = [];
        url.push(common.API_HOST + common.API_SCALE);
        url.push(common.API_HOST + common.API_MUSIC);
        var promise = crudPrvd.getArray(url);
        var successCallback = function(response) {
            vm.scale = response[0].data.datas;
            vm.music = response[1].data.datas;
            //vm.now_playing = vm.music[1].file_path;
        };
        var errorCallback = function(response) {
            console.dir(response);
        };
        promise.then(successCallback, errorCallback);
    };

    vm.selectScale = function(scale_id) {
        var row = vm.music.filter(function(item, index){
            if(item.scale_id == scale_id && item.time_id == 1) return true;
        });
        vm.now_playing = row[0].file_path;
    };

    /*vm.post = function() {
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
    };*/
});