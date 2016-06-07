angular.module("novel2music").factory("SharedStateService", function() {
    return {
        relation_novel_music: {},
        datas: [],
        decided: false
    };
});

angular.module("novel2music").controller('musicCtrl', function musicCtrl(common, crudPrvd, SharedStateService) {
    var vm = this;

    vm.init = function() {
        vm.select_music = {};
        vm.scale = {};
        vm.music = {};
        vm.time = {};
        vm.rhythm = {};
        vm.state = 0;
        vm.now_playing = "";
        var url = [];
        url.push(common.API_HOST + common.API_SCALE);
        url.push(common.API_HOST + common.API_MUSIC);
        url.push(common.API_HOST + common.API_TIME);
        url.push(common.API_HOST + common.API_RHYTHM);
        var promise = crudPrvd.getArray(url);
        var successCallback = function(response) {
            vm.scale = response[0].data.datas;
            vm.music = response[1].data.datas;
            vm.time = response[2].data.datas;
            vm.rhythm = response[3].data.datas;
            //vm.now_playing = vm.music[1].file_path;
        };
        var errorCallback = function(response) {
            console.dir(response);
        };
        promise.then(successCallback, errorCallback);
    };

    vm.checkReset = function(mod) {
        $(mod).attr("checked", false);
        vm.time_disabled = false;
        vm.rhythm_disabled = false;
    };

    vm.selectScale = function(scale_id) {
        var row = vm.music.filter(function(item, index){
            if(item.scale_id == scale_id && item.time_id == 1) return true;
        });
        vm.now_playing = row[0].file_path;
        vm.select_music.scale = row[0].scale_id;
        SharedStateService.relation_novel_music.music_id = row[0].id;
    };

    vm.selectTime = function(time_id) {
        //console.dir(vm.select_music);
        var row = vm.music.filter(function(item, index){
            if(item.scale_id == vm.select_music.scale && item.time_id == time_id) return true;
        });
        vm.now_playing = row[0].file_path;
        vm.select_music.time = row[0].time_id;
        SharedStateService.relation_novel_music.music_id = row[0].id;
    };

    vm.selectRhythm = function(rhythm_id) {
        var row = vm.music.filter(function(item, index){
            if(item.scale_id == vm.select_music.scale && item.time_id == vm.select_music.time && item.rhythm_id == rhythm_id) return true;
        });
        vm.now_playing = row[0].file_path;
        vm.select_music.rhythm = row[0].rhythm_id;
        SharedStateService.relation_novel_music.music_id = row[0].id;
    };

    vm.decidedMusic = function() {
        SharedStateService.datas.push(SharedStateService.relation_novel_music);
        $(".scale").attr("checked", false);
        $(".time").attr("checked", false);
        $(".rhythm").attr("checked", false);
        vm.time_disabled = false;
        vm.rhythm_disabled = false;
        vm.state = 0;
        SharedStateService.relation_novel_music = {};
        console.dir(SharedStateService.datas);
        SharedStateService.decided = true;
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