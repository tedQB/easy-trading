// ==UserScript==
// @name         choice面板汇总新闻
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=F*
// @grant        GM_addStyle
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @require      https://raw.githubusercontent.com/tedQB/easymoney/master/tampermonkey/category2.js?timestamp=3535435


// ==/UserScript==

(function () {
    'use strict';

    console.log(catejson);
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
        $("body").append("<div id='json2'></div>")
        var pickDataArray = [];
        var pickBkNameArray = [];
        var pickDateArray = [];
        var pickFromArray = [];
        var pickTitleArray = [];
        var pickUrlArray = [];
        var pickBkIDArray = [];

        $(".obj .si3").find("ul li").each(function (index, obj) {

            var tempObj = $(obj);
            tempObj.find(".si1 .type-string").each(function (index, obj) {
                if ($(obj).prev().text() == "NodeName") {
                    if ($(obj).text() !== "") {
                        pickBkNameArray.push($(obj).text().replace("\"", "").replace("\"", ""));
                    }
                    //抓取时间
                    var pickTempDateArray = [];
                    var pickTempFromArray = [];
                    var pickTempTitleArray = [];
                    var pickTempUrlArray = [];

                    tempObj.find(".si2 li").each(function (index, obj) {
                        $(obj).find(".si1 .type-string").each(function (index, obj) {
                            if ($(obj).text() !== "") {
                                pickTempDateArray.push($(obj).text().replace("\"", "").replace("\"", "").replace(/\d{4}-/g, ''));
                            }
                        });
                        $(obj).find(".si2 .type-string").each(function (index, obj) {
                            if ($(obj).text() !== "") {
                                pickTempFromArray.push($(obj).text().replace("\"", "").replace("\"", ""));
                            }
                        });
                        $(obj).find(".si5 .type-string").each(function (index, obj) {
                            if ($(obj).text() !== "") {
                                pickTempTitleArray.push($(obj).text().replace("\"", "").replace("\"", ""));
                            }
                        });
                        $(obj).find("li:last a").each(function (index, obj) {
                            if ($(obj).text() !== "") {
                                pickTempUrlArray.push($(obj).text().replace("\"", "").replace("\"", ""));
                            }
                        });
                    });
                    pickDateArray.push(pickTempDateArray);
                    pickFromArray.push(pickTempFromArray);
                    pickTitleArray.push(pickTempTitleArray);
                    pickUrlArray.push(pickTempUrlArray);
                }
            });

            tempObj.find(".si0 .type-string").each(function (index, obj) {
                if ($(obj).prev().text() == "NodeId") {
                    if ($(obj).text() !== "") {
                        pickBkIDArray.push($(obj).text().replace("\"", "").replace("\"", ""));
                    }
                }
            });
        });
        var pickChannelName = $(".obj .si2").eq(0).find(".type-string").text().replace("\"", "").replace("\"", "");
        $("#json2").css("margin-left", "100px").empty();
        $("#json2").append("<div id='news'></div>");

        console.log(pickBkNameArray.length);
        var fakeArr = new Array(parseInt(pickBkNameArray.length / 2));

        $.each(fakeArr, function (index, obj) {
            var tempWrap = 'wrap' + index;
            var num1 = index * 2;    //0,1|2,3|4,5|6,7
            var num2 = num1 + 1;
            $("#news").append("<div class=" + tempWrap + " style='overflow:hidden; '></div>");
            $("." + tempWrap).append("<div class='leftcol' style='float:left; width:660px; overflow:hidden; margin-right:5px; '><h3 style='margin-left:20px;'><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=" + pickBkIDArray[num1] + "&pageIndex=1&limit=50&sort=date&order=desc' target='_blank'>" + pickBkNameArray[num1] + "</a></h3><div class='cols cont" + num1 + "'></div></div>");
            $("." + tempWrap).append("<div class='rightcol' style='float:left; width:660px; overflow:hidden;  '><h3 style='margin-left:20px;'><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=" + pickBkIDArray[num2] + "&pageIndex=1&limit=50&sort=date&order=desc' target='_blank'>" + pickBkNameArray[num2] + "</a></h3><div class='cols cont" + num2 + "'></div></div>");

        });

        $.each(pickDateArray, function (index1, obj) {
            var tempCon = '.cont' + index1;

            $.each(obj, function (index2, objArr) {
                if (index2 % 2 == 0) {
                    $(tempCon).append("<p style='overflow:hidden; background-color:#EFEFEF;height:30px; line-height:30px; margin:0px 0px 0px 0px; padding-left:20px;'><span style='float:left;width:50px; text-align:left'>" + pickDateArray[index1][index2] + "</span> <a href=" + pickUrlArray[index1][index2] + " target='_blank'>" + pickTitleArray[index1][index2] + "</a></p>");
                } else {
                    $(tempCon).append("<p style='overflow:hidden; height:30px; line-height:30px; margin:0px 0px 0px 0px; padding-left:20px;'><span style='float:left;width:50px; text-align:left'>" + pickDateArray[index1][index2] + "</span> <a href=" + pickUrlArray[index1][index2] + " target='_blank'>" + pickTitleArray[index1][index2] + "</a></p>");
                }

            });



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
        $("#json2").before("<span style='position:absolute; top:65px; left:544px; width:200px; '><a href='" + hrefLast + "' style='text-decoration:none;'>上一页</a> <a href='" + hrefNext + "' style='text-decoration:none;'>下一页</a></span>");
        var urlTextHead = "<div class='tree'><ul class='inner'>";
        var urlTextFoot = "</ul></div>";
        var urlTextBody = [];

        for (var i in catejson) {
            if (catejson[i].constructor === Object) {
                urlTextBody.push(`<li class=''><a href='#' class='sd'>${i}</a><ul class='close'>`);
                for (var j in catejson[i]) {
                    if (catejson[i][j].indexOf("F") != -1) {
                        urlTextBody.push(`<li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=${catejson[i][j]}&limit=8&pageIndex=1'>${j}</a></li>`);
                    } else {
                        urlTextBody.push(`<li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=${catejson[i][j]}&pageIndex=1&limit=100&sort=date&order=desc'>${j}</a></li>`);
                    }
                }
                urlTextBody.push(`</ul></li>`);
            } else {
                urlTextBody.push(`<li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=${catejson[i]}&pageIndex=1&limit=100&sort=date&order=desc'>${i}</a></li>`);
            }
        }

        var treeText = urlTextHead + urlTextBody.join("") + urlTextFoot;

        $("#json2").append(treeText);

        $("#json2").append("<span style='position:absolute; margin-bottom:10px; left:544px; width:200px; '><a href='" + hrefLast + "' style='text-decoration:none;'>上一页</a> <a href='" + hrefNext + "' style='text-decoration:none;'>下一页</a></span>");

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
            })
        })
        var tit = $('.tit').text();
        $('.tree li a').each(function (index, obj) {
            if ($(obj).text() == tit) {
                $(obj).addClass('link')
            }
        })

        addStyle();

    }, 200);
    function addStyle() {
        GM_addStyle(`
    body{ display:none; }
    .close{ display:none; margin-left:10px; }
    .open{ display:block; }
    .tree{ height:650px; padding-right:5px; overflow-y:scroll; position:fixed; top:20px; left:0px; width:100px; background:#fff;  margin-left:0px;}
    .link{ background:rgba(235,238,249,1)}
    .inner{ margin-left:0px; }
  `);
    }
    // Your code here...
})();