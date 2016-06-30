angular.module("novel2music").controller('resultIndexCtrl', function resultIndexCtrl(common, crudPrvd, resultPrvd) {
    var vm = this;

    vm.init = function() {
        vm.music_parameter = ["Scale", "Rhythm", "Time"];
        vm.novels = [];
        vm.scales = [];
        vm.rhythms = [];
        vm.times = [];
        vm.selected = 0;
        vm.selectMenu(0);
        vm.getUser(); //0
        vm.getNovelMusic(); //1
    };

    vm.selectMenu = function(id) {
        if(id === 0) {
            vm.selected = 0;
            vm.graph_title = "ユーザ属性";
            vm.sentence = "ユーザ登録のみの被験者は除外している";
        } else if(id == 1) {
            vm.selected = 1;
            vm.graph_title = "小説と音楽";
            vm.sentence = "小説と音楽の相関関係について。その得票数など。";
        }
    };

    vm.setNovelMusicState = function(novel_num, music_num) {
        vm.novel_music_state = {novel: novel_num, music: music_num};
        vm.formattedNovelMusic(vm.novel_music_state.novel, vm.novel_music_state.music);
    };

    vm.getNovelMusic = function() {
        vm.novel_music_state = {novel: 0, music: 0};
        var urls = [];
        urls.push(common.API_HOST + common.API_NOVEL);
        urls.push(common.API_HOST + common.API_SCALE);
        urls.push(common.API_HOST + common.API_RHYTHM);
        urls.push(common.API_HOST + common.API_TIME);
        var promise = crudPrvd.getArray(urls);
        var successCallback = function(response) {
            vm.novels = response[0].data.datas;
            vm.scales = response[1].data.datas;
            vm.rhythms = response[2].data.datas;
            vm.times = response[3].data.datas;
            //console.dir(vm.novels);
            vm.formattedNovelMusic(vm.novel_music_state.novel, vm.novel_music_state.music_num);
        };
        var errorCallback = function(response) {
            console.dir(response);
        };
        promise.then(successCallback, errorCallback);
    };

    vm.formattedNovelMusic = function(novel_num, music_num) {
        var color_code = [
            {R:255, G:191, B:127},
            {R:255, G:255, B:127},
            {R:191, G:255, B:127},
            {R:127, G:255, B:127},
            {R:127, G:255, B:191},
            {R:127, G:255, B:255},
            {R:127, G:255, B:255},
            {R:127, G:191, B:255},
            {R:127, G:127, B:255},
            {R:191, G:127, B:255},
            {R:255, G:127, B:255},
            {R:255, G:127, B:191},
            {R:255, G:127, B:127}
        ];
        var graph_id = "#novel_music";
        vm.clearGraph(graph_id);
        var url = common.API_HOST + common.API_RELATION_NOVEL + "?novel_id="+(novel_num+1);
        var promise = crudPrvd.get(url);
        var successCallback = function(response) {
            if(response.data.datas.length === 0) {
                return;
            }
            var data = response.data.datas;
            var list = {};
            list.paragraph_num = Math.max.apply(Math, data.map(function(o){return o.paragraph_id;}));
            list.datas = [];
            var vote = 0;
            var group = [];
            var i, j, k;
            if(music_num === 0) { //scale
                list.label = vm.scales;
                for(i=0; i<list.paragraph_num; i++) {
                    for(j=0; j<vm.scales.length; j++) {
                        for(k=0; k<data.length; k++) {
                            if(data[k].scale_id == vm.scales[j].id && data[k].paragraph_id == i+1) {
                                vote++;
                            }
                        }
                        group.push({x: vm.scales[j].id, y: vote});
                        vote = 0;
                    }
                    list.datas.push(group);
                    group = [];
                }
                /*list.label = vm.scales;
                for(var i=0; i<vm.scales.length; i++) {
                    var vote = 0;
                    for(var j=0; j<list.paragraph_num; j++) {
                        for(var k=0; k<data.length; k++) {
                            if(data[k].scale_id == vm.scales[i].id && data[k].paragraph_id == j+1) {
                                vote++;
                            }
                        }
                        list.datas.push({
                            scale: vm.scales[i].id,
                            paragraph_id: j+1,
                            vote: vote,
                            color: "fill:rgb("+color_code[j].R+","+color_code[j].G+","+color_code[j].B+")"
                        });
                        vote = 0;
                    }
                }*/
            } else if(music_num == 1) { //rhythm
                //var reduce_rhythms = vm.rhythms.slice(1);
                var reduce_rhythms = vm.rhythms;
                list.label = reduce_rhythms;
                for(i=0; i<list.paragraph_num; i++) {
                    for(j=0; j<reduce_rhythms.length; j++) {
                        for(k=0; k<data.length; k++) {
                            if(data[k].rhythm_id == reduce_rhythms[j].id && data[k].paragraph_id == i+1) {
                                vote++;
                            }
                        }
                        group.push({x: reduce_rhythms[j].id, y: vote});
                        vote = 0;
                    }
                    list.datas.push(group);
                    group = [];
                }
            } else if(music_num == 2) { //time
                list.label = vm.times;
                for(i=0; i<list.paragraph_num; i++) {
                    for(j=0; j<vm.times.length; j++) {
                        for(k=0; k<data.length; k++) {
                            if(data[k].time_id == vm.times[j].id && data[k].paragraph_id == i+1) {
                                vote++;
                            }
                        }
                        group.push({x: vm.times[j].id, y: vote});
                        vote = 0;
                    }
                    list.datas.push(group);
                    group = [];
                }
            }
            vm.renderBar(graph_id, list);
        };
        var errorCallback = function(response) {
            console.dir(response);
        };
        promise.then(successCallback, errorCallback);
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
        };
        var errorCallback = function(response) {
            console.dir(response);
        };
        promise.then(successCallback, errorCallback);
    };

    vm.clearGraph = function(graph_id) {
        d3.select(graph_id).selectAll("svg").remove();
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

    vm.renderBar = function(id, dataset) {
        //console.log(dataset.datas);
        var size = {width: 800, height:1000, margin_x:100, bar_y:270, scale: 15};
        
        list = dataset.datas;
        var color_code = [
            "rgb(255, 191, 127)",
            "rgb(255, 255, 127)",
            "rgb(191, 255, 127)",
            "rgb(127, 255, 127)",
            "rgb(127, 255, 191)",
            "rgb(127, 255, 255)",
            "rgb(127, 191, 255)",
            "rgb(127, 127, 255)",
            "rgb(191, 127, 255)",
            "rgb(255, 127, 255)",
            "rgb(255, 127, 191)",
            "rgb(255, 127, 127)"
        ];
        var svg = d3.select(id).append("svg")
            .attr("width", size.width).attr("height", size.height);
        var stack = d3.layout.stack();   // 積み上げ棒グラフ
        var dataSet = stack(list);  // データをセット
        svg.selectAll("g")  // グループ化するので、それらを対象にする
            .data(dataSet)
            .enter()
            .append("g")    // グループ追加
            .attr("style", function(d, i){   // ここでグラフの色を設定する
                return "fill:"+color_code[i];
            })
            .selectAll("rect")  // 棒グラフ1つを対象にする
            .data(function(d){ return d; }) // 1つのデータを読み込む
            .enter()
            .append("rect") // 棒グラフ1つ1つを生成する
            .attr("x", function(d){  // X座標を計算
                return size.margin_x + d.y0 * size.scale;
            })
            .attr("y", function(d, i){ // 下から積み上げるための座標を計算。上からならd.y0だけでOK
                return i * 50;
            })
            .attr("width", function(d, i){
                return d.y * size.scale;
            })  // 棒グラフの横幅
            .attr("height", function(d){    // 棒グラフの高さ
                return 30;
                //return d.y;
            });

        //棒グラフの数値を描画する
        var i=0;
        var j=0;
        for(i=0; i<list.length; i++) {
            for(j=0; j<list[i].length; j++) {
                if(list[i][j].y !== 0) {
                    svg
                    .append("text")          //text要素を追加
                    //.attr("class ","barNum")  //CSSクラスを指定
                    .attr("x", size.margin_x + list[i][j].y0 * size.scale)
                    .attr("y", list[i][j].x * 50 - 15)//Ｙ座標を指定
                    //.attr("width", size.width)
                    //.attr("height", size.height)
                    //.attr("transform","translate(1000, 0)" )
                    .text(list[i][j].y);
                }
            }
        }

        //横軸の描画
        svg
        .append("rect")
        .attr("class","axisY")
        .attr("width", 1)
        .attr("height", size.height)
        .attr("transform","translate("+size.margin_x+", 0)" );

        //棒のラベルを表示する
        for(i=0; i<dataset.label.length; i++) {
            svg
            .append("text")
            .attr("x", 30)
            .attr("y", 50 * i + 20)
            .attr("width", 100)
            .attr("height", size.height)
            .text(dataset.label[i].name);
        }

        //legend
        //http://shimz.me/blog/d3-js/4411
        //カテゴリ
        var category = [];
        for(i=0; i<dataset.datas.length; i++) {
            category.push("第"+(i+1)+"段落");
        }
         
        //カラースケールをオリジナルスケールとして指定する
        var colorScale = d3.scale.ordinal()
            .domain(category)   //カテゴリを指定
            .range(color_code);
        //凡例を表示するグループ要素 
        svg.append('g')
            .attr('class', 'legendLinear')
            .attr("transform", "translate("+(size.width-100)+",20)");

        //スケールを元に凡例を生成する
        var legendLinear = d3.legend.color()
            .shapeWidth(30)
            .scale(colorScale);
         
        //凡例を描画する
        svg.select('.legendLinear')
            .call(legendLinear);
    };
});