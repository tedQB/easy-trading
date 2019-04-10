// ==UserScript==
// @name         choice一级快捷新闻
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S*
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @grant        GM_addStyle


// ==/UserScript==

(function () {
    'use strict';

    //缓存框架--begin
    var config = {
        debug: true
    }
    function setCache(key, obj) {
        var data = JSON.stringify(obj);
        var jsonData = { "data": obj };
        if (config.debug) {
            console.log("设置缓存数据：" + data);
        }
        return localStorage.setItem(key, JSON.stringify(jsonData));
    }

    function getCache(key) {
        if (!key) {
            if (config.debug) {
                console.log("key为空，key=【" + key + "】");
            }
            return "";
        }
        var jsonData = JSON.parse(localStorage.getItem(key));
        if (!jsonData) {
            if (config.debug) {
                console.log("【" + key + "】缓存的数据不存在");
            }
            return "";
        }
        if (config.debug) {
            console.log("【" + key + "】获取到的缓存数据：" + jsonData.data);
        }
        return jsonData.data;
    }


    function apartMinutes(date1, date2) {
        var date3 = date2 - date1;
        var minutes = Math.floor(date3 / (60 * 1000));
        if (config.debug) {
            console.log("数据已缓存时间：" + minutes + "分钟");
        }
        return minutes;
    }

    var cache = {
        getCache: getCache,
        setCache: setCache,
        configCache: function (obj) {
            $.extend(config, obj);
        }
    };

    $.extend($, cache);
    //缓存框架--end

    setTimeout(function () {
        var pickDateArray = [];
        var pickFromArray = [];
        var pickTitleArray = [];
        var pickUrlArray = [];
        $("body").append("<div id='json2'></div>")
        $(".obj .si3").find("li").each(function (index, obj) {
            $(obj).find(".si1 .type-string").each(function (index, obj) {
                if ($(obj).text() !== "") {
                    pickDateArray.push($(obj).text().replace("\"", "").replace("\"", "").replace(/\d{4}-/g, ''));
                }
            });
            $(obj).find(".si2 .type-string").each(function (index, obj) {
                if ($(obj).text() !== "") {
                    pickFromArray.push($(obj).text().replace("\"", "").replace("\"", ""));
                }
            });
            $(obj).find(".si5 .type-string").each(function (index, obj) {
                if ($(obj).text() !== "") {
                    pickTitleArray.push($(obj).text().replace("\"", "").replace("\"", ""));
                }
            });
            $(obj).find("li:last a").each(function (index, obj) {
                if ($(obj).text() !== "") {
                    pickUrlArray.push($(obj).text().replace("\"", "").replace("\"", ""));
                }
            });
        });
        var pickChannelName = $(".obj .si2").eq(0).find(".type-string").text().replace("\"", "").replace("\"", "");
        $("#json2").css("margin-left", "100px").empty().append("<h2 style='margin-left:30px' class='tit'>" + pickChannelName + "</h2>");
        $("#json2").append("<div id='news'></div>");
        $.each(pickDateArray, function (index, obj) {
            if (index % 2 == 0) {
                $("#news").append("<p style='overflow:hidden; background-color:#EFEFEF;height:30px; line-height:30px; margin:0px 0px 0px 0px; padding-left:30px;'><span style='float:left;width:53px; text-align:left'><span style='float:right; margin-right:10px'>" + pickDateArray[index] + "</span></span> <a href=" + pickUrlArray[index] + " target='_blank'>" + pickTitleArray[index] + "</a></p>");
            } else {
                $("#news").append("<p style='overflow:hidden; height:30px; line-height:30px; margin:0px 0px 0px 0px; padding-left:30px;'><span style='float:left;width:53px; text-align:left'><span style='float:right; margin-right:10px'>" + pickDateArray[index] + "</span></span> <a href=" + pickUrlArray[index] + " target='_blank'>" + pickTitleArray[index] + "</a></p>");
            }

        });
        $("body").css("font-size", "14px").css("margin", "0px");
        $("#news a").css("color", "#000").css("text-decoration", "none");
        $("#news a").hover(
            function () {
                $(this).css("text-decoration", "underline").css("color", "#425bff");
            },
            function () {
                $(this).css("color", "#000").css("text-decoration", "none");
            }
        );

        $(".status").hide();

        /*搜索框*/

        $("#json2").before("<div style='margin-top:20px;margin-left:105px'><input type='text' style='width:280px;height:25px' id='searchText'/ > <input type='button' value='提交' id='subText' /></div>");

        $("#subText").on("click", function () {
            window.open("http://app.jg.eastmoney.com/NewsData/GetNewsBySearch.do?types=&text='" + $('#searchText').val() + "'&title=&source=&pageIndex=1&limit=100&sort=date&order=desc");
        });

        $(document).keypress(function (event) {
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode == '13') {
                window.open("http://app.jg.eastmoney.com/NewsData/GetNewsBySearch.do?types=&text='" + $('#searchText').val() + "'&title=&source=&pageIndex=1&limit=100&sort=date&order=desc");
            }
        });

        /*生成页码*/
        function GetRequest() {
            var url = location.search; //获取url中"?"符后的字串
            var theRequest = {};
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                var strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
                }
            }
            return theRequest;
        }
        var currentPage = parseInt(GetRequest().pageIndex);

        function changeURLArg(url, arg, arg_val) {
            var pattern = arg + '=([^&]*)';
            var replaceText = arg + '=' + arg_val;
            if (url.match(pattern)) {
                var tmp = '/(' + arg + '=)([^&]*)/gi';
                tmp = url.replace(eval(tmp), replaceText);
                return tmp;
            } else {
                if (url.match('[\?]')) {
                    return url + '&' + replaceText;
                } else {
                    return url + '?' + replaceText;
                }
            }
        }
        var hrefNext = changeURLArg(window.location.href, 'pageIndex', currentPage + 1);
        var hrefLast = changeURLArg(window.location.href, 'pageIndex', currentPage - 1);
        $("#json2").before("<span style='position:absolute; top:65px; left:544px; width:200px;'><a href='" + hrefLast + "' style='text-decoration:none;'>上一页</a> <a href='" + hrefNext + "' style='text-decoration:none;'>下一页</a></span>");

        //树形模块
        var urlText = "<div class='tree' style='position:fixed; top:20px; left:0px; width:100px; background:#fff;  margin-left:0px;'><ul class='inner'>"
            + "<li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888005001&pageIndex=1&limit=100&sort=date&order=desc'>全部新闻</a></li>"
            + "<li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888005003&pageIndex=1&limit=100&sort=date&order=desc'>财经要闻</a></li>"
            + "<li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=F888006&limit=8&pageIndex=1'>媒体新闻</a></li>"
            + "<li class=''><a href='#' class='sd'>政府新闻板块</a>"
            + " <ul class='close'><li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=F888019&limit=8&pageIndex=1'>政府聚合</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888019002&pageIndex=1&limit=50&sort=date&order=desc'>国务院</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888019003&pageIndex=1&limit=50&sort=date&order=desc'>发改委</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888019004&pageIndex=1&limit=50&sort=date&order=desc'>国资委</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888019005&pageIndex=1&limit=50&sort=date&order=desc'>央行</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888019007&pageIndex=1&limit=50&sort=date&order=desc'>工信部</a></li>"
            + " </ul></li>"
            + "<li class=''><a href='#' class='sd'>期货品种</a>"
            + " <ul class='close'>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888016001&pageIndex=1&limit=50&sort=date&order=desc'>原油</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888016002&pageIndex=1&limit=50&sort=date&order=desc'>燃料油</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888016003&pageIndex=1&limit=50&sort=date&order=desc'>动力煤</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888016034&pageIndex=1&limit=50&sort=date&order=desc'>PTA</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888016032&pageIndex=1&limit=50&sort=date&order=desc'>沥青</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888016007&pageIndex=1&limit=50&sort=date&order=desc'>钢材</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888016008&pageIndex=1&limit=50&sort=date&order=desc'>铁矿石</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888016004&pageIndex=1&limit=50&sort=date&order=desc'>焦煤</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888016005&pageIndex=1&limit=50&sort=date&order=desc'>焦炭</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888016035&pageIndex=1&limit=50&sort=date&order=desc'>甲醇</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888016018&pageIndex=1&limit=50&sort=date&order=desc'>豆粕</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888016017&pageIndex=1&limit=50&sort=date&order=desc'>大豆</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888016023&pageIndex=1&limit=50&sort=date&order=desc'>糖</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888016024&pageIndex=1&limit=50&sort=date&order=desc'>棉花</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888016029&pageIndex=1&limit=50&sort=date&order=desc'>鸡蛋</a></li>"
            + " </ul></li>"
            + "<li class=''><a href='#' class='sd'>行业分类</a>"
            + " <ul class='close'>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020001&pageIndex=1&limit=50&sort=date&order=desc'>房地产</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020002&pageIndex=1&limit=50&sort=date&order=desc'>银行业</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020003&pageIndex=1&limit=50&sort=date&order=desc'>证券业</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020004&pageIndex=1&limit=50&sort=date&order=desc'>保险业</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020005&pageIndex=1&limit=50&sort=date&order=desc'>信托业</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020006&pageIndex=1&limit=50&sort=date&order=desc'>担保业</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020007&pageIndex=1&limit=50&sort=date&order=desc'>钢铁</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020008&pageIndex=1&limit=50&sort=date&order=desc'>煤炭</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020009&pageIndex=1&limit=50&sort=date&order=desc'>汽车制造</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020010&pageIndex=1&limit=50&sort=date&order=desc'>互联网</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020011&pageIndex=1&limit=50&sort=date&order=desc'>家用电器</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020012&pageIndex=1&limit=50&sort=date&order=desc'>石油天然气</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020013&pageIndex=1&limit=50&sort=date&order=desc'>贵金属</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020014&pageIndex=1&limit=50&sort=date&order=desc'>有色金属</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020015&pageIndex=1&limit=50&sort=date&order=desc'>基础化工</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020016&pageIndex=1&limit=50&sort=date&order=desc'>化工农药</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020017&pageIndex=1&limit=50&sort=date&order=desc'>化纤</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020018&pageIndex=1&limit=50&sort=date&order=desc'>造纸包装</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020019&pageIndex=1&limit=50&sort=date&order=desc'>建筑</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020020&pageIndex=1&limit=50&sort=date&order=desc'>建材</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020021&pageIndex=1&limit=50&sort=date&order=desc'>林木</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020022&pageIndex=1&limit=50&sort=date&order=desc'>航空机场</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020023&pageIndex=1&limit=50&sort=date&order=desc'>物流</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020024&pageIndex=1&limit=50&sort=date&order=desc'>铁路公路</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020025&pageIndex=1&limit=50&sort=date&order=desc'>海运港口</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020026&pageIndex=1&limit=50&sort=date&order=desc'>国防军工</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020027&pageIndex=1&limit=50&sort=date&order=desc'>工业机械</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020028&pageIndex=1&limit=50&sort=date&order=desc'>船舶重工</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020029&pageIndex=1&limit=50&sort=date&order=desc'>电气设备</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020030&pageIndex=1&limit=50&sort=date&order=desc'>计算机</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020031&pageIndex=1&limit=50&sort=date&order=desc'>通信设备</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020032&pageIndex=1&limit=50&sort=date&order=desc'>电子设备</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020033&pageIndex=1&limit=50&sort=date&order=desc'>软件</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020034&pageIndex=1&limit=50&sort=date&order=desc'>电信服务</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020035&pageIndex=1&limit=50&sort=date&order=desc'>零售</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020036&pageIndex=1&limit=50&sort=date&order=desc'>贸易</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020037&pageIndex=1&limit=50&sort=date&order=desc'>纺织服装</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020038&pageIndex=1&limit=50&sort=date&order=desc'>消费电子</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020039&pageIndex=1&limit=50&sort=date&order=desc'>半导体</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020040&pageIndex=1&limit=50&sort=date&order=desc'>家居用品</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020041&pageIndex=1&limit=50&sort=date&order=desc'>文化传媒</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020042&pageIndex=1&limit=50&sort=date&order=desc'>娱乐休闲</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020043&pageIndex=1&limit=50&sort=date&order=desc'>日化</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020044&pageIndex=1&limit=50&sort=date&order=desc'>农产品</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020045&pageIndex=1&limit=50&sort=date&order=desc'>食品饮料</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020046&pageIndex=1&limit=50&sort=date&order=desc'>酒业</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020047&pageIndex=1&limit=50&sort=date&order=desc'>餐饮旅游</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020048&pageIndex=1&limit=50&sort=date&order=desc'>医疗保健</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020049&pageIndex=1&limit=50&sort=date&order=desc'>生物科技</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020050&pageIndex=1&limit=50&sort=date&order=desc'>电力</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020051&pageIndex=1&limit=50&sort=date&order=desc'>水务</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020052&pageIndex=1&limit=50&sort=date&order=desc'>燃气</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020053&pageIndex=1&limit=50&sort=date&order=desc'>环保</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020054&pageIndex=1&limit=50&sort=date&order=desc'>新能源</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020055&pageIndex=1&limit=50&sort=date&order=desc'>风力发电</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020056&pageIndex=1&limit=50&sort=date&order=desc'>光伏发电</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020057&pageIndex=1&limit=50&sort=date&order=desc'>火力发电</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020058&pageIndex=1&limit=50&sort=date&order=desc'>水力发电</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020059&pageIndex=1&limit=50&sort=date&order=desc'>核电</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020060&pageIndex=1&limit=50&sort=date&order=desc'>智能电网</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020061&pageIndex=1&limit=50&sort=date&order=desc'>输配电</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020062&pageIndex=1&limit=50&sort=date&order=desc'>电线电缆</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020063&pageIndex=1&limit=50&sort=date&order=desc'>储能</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020064&pageIndex=1&limit=50&sort=date&order=desc'>通用机械</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020065&pageIndex=1&limit=50&sort=date&order=desc'>仪器仪表</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020066&pageIndex=1&limit=50&sort=date&order=desc'>专用设备</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020067&pageIndex=1&limit=50&sort=date&order=desc'>金属制品</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020068&pageIndex=1&limit=50&sort=date&order=desc'>运输设备</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888020069&pageIndex=1&limit=50&sort=date&order=desc'>运输设备</a></li>"
            + " </ul></li>"
            + "</ul></div>";

        $("#json2").append(urlText);
        $('body').addClass('open');

        $(".tree li a").css("text-decoration", "none").css("display", "block").css("height", "30px").css("line-height", "30px").css("padding-left", "10px");
        $('.tree .sd').each(function (index, obj) {
            var classNameT = $(obj).attr("class") + index;
            if ($.getCache(classNameT) == 'open') {
                $(obj).next('.close').addClass('open')
            }

            $(obj).click(function () {
                var ds = $(this).next('.close');
                var keyName = 'sd' + index;
                if (ds.hasClass("open")) {
                    ds.removeClass("open");
                    $.setCache(keyName, 'close');
                } else {
                    ds.addClass("open");
                    $.setCache(keyName, 'open');
                }
                console.log($('.inner').height())
            })
        })
        var tit = $('.tit').text();
        $('.tree li a').each(function (index, obj) {
            if ($(obj).text() == tit) {
                $(obj).addClass('link')
            }
        })

        addStyle();
    }, 100);


    function addStyle() {
        GM_addStyle(`
    body{ display:none; }
    .close{ display:none; margin-left:10px; }
    .open{ display:block; }
    .tree{ height:650px; padding-right:5px; overflow-y:scroll}
    .link{ background:rgba(235,238,249,1)}
    .inner{ margin-left:0px; }
  `);
    }
    // Your code here...
})();