angular.module("novel2music").controller('resultIndexCtrl', function resultIndexCtrl(common, crudPrvd, resultPrvd) {
    var vm = this;

    vm.init = function() {
        vm.selected = 0;
        vm.selectMenu(0);
        vm.getUser();
    };

    vm.selectMenu = function(id) {
        if(id === 0) {
            vm.selected = 0;
            vm.graph_title = "ユーザ属性";
            vm.sentence = "ユーザ登録のみの被験者は除外している";
        } else if(id == 1) {
            vm.selected = 1;
            vm.graph_title = "小説と音楽";
            vm.sentence = "あああああああ";
        }
    };

    vm.getUser = function() {
        vm.user_heading=[
            {title: "年代", id: "age"},
            {title:"性別", id: "sex"},
            {title:"趣味等で音楽活動をしたことがありますか？", id: "questionnaire_1"},
            {title:"クラシック音楽を普段鑑賞しますか？", id: "questionnaire_2"},
            {title:"絶対音感、または、相対音感をお持ちですか？", id: "questionnaire_3"},
            {title:"音楽理論を勉強したことがありますか？", id: "questionnaire_4"}
        ];
        var url = common.API_HOST + common.API_USER;
        var promise = crudPrvd.get(url);
        var successCallback = function(response) {
            //年代
            var i = 0;
            var age = [
                {legend:"20代", value: 0, color: "orange"},
                {legend:"30代", value: 0, color: "yellow"}
            ];
            for (i = 0;  i < response.data.datas.length; i++) {
                if(response.data.datas[i].age >= 20 && response.data.datas[i].age < 30){
                    age[0].value++;
                }
                if(response.data.datas[i].age >= 30 && response.data.datas[i].age < 40){
                    age[1].value++;
                }
            }
            vm.renderPie("#age", age);

            //性別
            var sex = [
                {legend:"女性", value: 0, color: "pink"},
                {legend:"男性", value: 0, color: "blue"}
            ];
            for (i = 0;  i < response.data.datas.length; i++) {
                if(response.data.datas[i].sex == "f"){
                    sex[0].value++;
                }
                if(response.data.datas[i].sex == "m"){
                    sex[1].value++;
                }
            }
            vm.renderPie("#sex", sex);

            //趣味等で音楽活動をしたことがありますか？
            var q1 = [
                {legend:"はい", value: 0, color: "IndianRed"},
                {legend:"いいえ", value: 0, color: "skyblue"}
            ];
            for (i = 0;  i < response.data.datas.length; i++) {
                if(response.data.datas[i].questionnaire_1 == 1){
                    q1[0].value++;
                }
                if(response.data.datas[i].questionnaire_1 == "0"){
                    q1[1].value++;
                }
            }
            vm.renderPie("#questionnaire_1", q1);

            //クラシック音楽を普段鑑賞しますか？
            var q2 = [
                {legend:"はい", value: 0, color: "IndianRed"},
                {legend:"いいえ", value: 0, color: "skyblue"}
            ];
            for (i = 0;  i < response.data.datas.length; i++) {
                if(response.data.datas[i].questionnaire_2 == 1){
                    q2[0].value++;
                }
                if(response.data.datas[i].questionnaire_2 == "0"){
                    q2[1].value++;
                }
            }
            vm.renderPie("#questionnaire_2", q2);

            //絶対音感、または、相対音感をお持ちですか？
            var q3 = [
                {legend:"なし", value: 0, color: "skyblue"},
                {legend:"相対音感", value: 0, color: "IndianRed"},
                {legend:"絶対音感", value: 0, color: "greenyellow"},
            ];
            for (i = 0;  i < response.data.datas.length; i++) {
                if(response.data.datas[i].questionnaire_3 == "0"){
                    q3[0].value++;
                }
                if(response.data.datas[i].questionnaire_3 == 1){
                    q3[1].value++;
                }
                if(response.data.datas[i].questionnaire_3 == 2){
                    q3[2].value++;
                }
            }
            vm.renderPie("#questionnaire_3", q3);

            //音楽理論を勉強したことがありますか？
            var q4 = [
                {legend:"はい", value: 0, color: "IndianRed"},
                {legend:"いいえ", value: 0, color: "skyblue"},
            ];
            for (i = 0;  i < response.data.datas.length; i++) {
                if(response.data.datas[i].questionnaire_4 == 1){
                    q4[0].value++;
                }
                if(response.data.datas[i].questionnaire_4 == "0"){
                    q4[1].value++;
                }
            }
            vm.renderPie("#questionnaire_4", q4);


            console.dir(response);
        };
        var errorCallback = function(response) {
            console.dir(response);
        };
        promise.then(successCallback, errorCallback);
    };

    vm.renderPie = function(id, dataset) {
        var size = {width: 300, height:300, radius:150};
        var svg = d3.select(id).append("svg")
        .attr("width", size.width)
        .attr("height", size.height)
        .append("g")
        .attr("transform", "translate(" + size.width / 2 + "," + size.height / 2 + ")");

        var arc = d3.svg.arc()
        .outerRadius(size.radius)
        .innerRadius(0);

        var pie = d3.layout.pie()
        .sort(null)
        .value(function(d){ return d.value; });

        var g = svg.selectAll(".fan")
        .data(pie(dataset))
        .enter()
        .append("g")
        .attr("class", "fan");

        g.append("path")
        .attr("d", arc)
        .attr("fill", function(d){ return d.data.color; });

        g.append("text")
        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
        .style("text-anchor", "middle")
        .text(function(d) {
            if(d.data.value > 0) {
                return d.data.legend+":"+d.data.value;
            }
            else {
                return "";
            }
        });
    };
});