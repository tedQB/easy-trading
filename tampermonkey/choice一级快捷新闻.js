// ==UserScript==
// @name         choice一级快捷新闻
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// ==/UserScript==

(function () {
    'use strict';
    setTimeout(function () {
        var pickDateArray = [];
        var pickFromArray = [];
        var pickTitleArray = [];
        var pickUrlArray = [];

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
        $("#json").css("margin-left", "100px").empty().append("<h2 style='margin-left:30px'>" + pickChannelName + "</h2>");
        $("#json").append("<div id='news'></div>");
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

        $("#json").before("<div style='margin-top:20px;margin-left:100px'><input type='text' style='width:280px;height:25px' id='searchText'/ > <input type='button' value='提交' id='subText' /></div>");

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
        $("#json").before("<span style='position:absolute; top:65px; left:544px; width:200px;'><a href='" + hrefLast + "' style='text-decoration:none;'>上一页</a> <a href='" + hrefNext + "' style='text-decoration:none;'>下一页</a></span>");

        //树形模块
        var urlText = "<ul class='tree' style='position:fixed; top:20px; left:0px; width:100px; height:100%; background:#fff;  margin-left:0px;'>"
            + "<li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888005001&pageIndex=1&limit=100&sort=date&order=desc'>全部新闻</a></li>"
            + "<li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888005003&pageIndex=1&limit=100&sort=date&order=desc'>财经新闻</a></li>"
            + "<li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=F888006&limit=8&pageIndex=1'>媒新闻板块</a></li>"
            + "<li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=F888019&limit=8&pageIndex=1'>政府新闻板块</a>"
            + " <ul><li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888019002&pageIndex=1&limit=50&sort=date&order=desc'>国务院</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888019003&pageIndex=1&limit=50&sort=date&order=desc'>发改委</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888019004&pageIndex=1&limit=50&sort=date&order=desc'>国资委</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888019005&pageIndex=1&limit=50&sort=date&order=desc'>央行</a></li>"
            + "  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888019007&pageIndex=1&limit=50&sort=date&order=desc'>工信部</a></li>"
            + " </ul></li>"
            + "</ul>";
        $("#json").append(urlText);
        $(".tree li a").css("text-decoration", "none").css("display", "block").css("height", "30px").css("line-height", "30px").css("padding-left", "10px");
    });



    // Your code here...
})();