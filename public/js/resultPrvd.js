angular.module("novel2music").provider('resultPrvd', function() {
    var vm = this;

    vm.$get = function($timeout, $window, $document) {
        return {
            showResult: function(vm, sentence, url) {
                vm.result_flg = true;
                vm.sentence = sentence;
                $timeout(function() {
                    $window.location = url;
                }, 2000);
            },
            showResultPost: function(vm, sentence) {
                vm.result_flg = true;
                vm.sentence = sentence;
                $timeout(function() {
                    //$document.getElementById('postReload').submit();
                    angular.element('#post_reload').submit();
                }, 2000);
            },
            showFaild: function(vm, sentence) {
                vm.result_flg = true;
                vm.sentence = sentence;
                $timeout(function() {
                    vm.result_flg = false;
                    //vm.isDoubleClick = false;
                }, 2000);
            }
        };
    };
});
