// ==UserScript==
// @name         99期货单位持仓变化表
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://service.99qh.com/hold2/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @require      https://mta.qq.com/mta/resource/scripts/highcharts.js?t=1438071557
// @require      http://www.jiese360.com/js/highcharts-more-v161110.js


// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    var $ = jQuery;
    $('body').empty();
    function formatTime(date) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        month = month < 10 ? '0' + month : month;
        var day = date.getDate();
        day = day < 10 ? '0' + day : day;
        return year + '-' + month + '-' + day;
    }
    // nowDate = formatTime(nowDate).split('-');
    // var date = new Date();//获取当前时间
    // date.setDate(date.getDate()-3);//设置天数 -1 天


    //console.log(formatTime(date));
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }

    var ajaxes = [];
    $('body').append("<div id='highchart0'></div><div id='highchart1'></div><div id='highchart2'></div>");
    var code = $.getUrlParam('agreement');
    console.log($.getUrlParam('old'));
    if ($.getUrlParam('old')) {
        for (var j = 40; j >= 0; j--) {
            $('body').append("<div id='in" + j + "'></div>");
            var date = $.getUrlParam('date');
            date = new Date(Date.parse(date.replace(/-/g, "/")));
            console.log(date);
            date.setDate(date.getDate() - j);
            var ajaxurl = 'http://service.99qh.com/hold2/MemberHold/GetTableHtml.aspx?date=' + formatTime(date) + '&user=99qh&goods=80&agreement=' + code + '&count=0&_=1534589951130';

            ajaxes.push({ ajaxurl: ajaxurl, divId: "#in" + j, dateTime: formatTime(date) });
        }
    } else {
        for (var i = 40; i >= 0; i--) {
            $('body').append("<div id='in" + i + "'></div>");
            var date = new Date();
            date.setDate(date.getDate() - i);
            console.log(date);
            var ajaxurl = 'http://service.99qh.com/hold2/MemberHold/GetTableHtml.aspx?date=' + formatTime(date) + '&user=99qh&goods=80&agreement=' + code + '&count=0&_=1534589951130';

            ajaxes.push({ ajaxurl: ajaxurl, divId: "#in" + i, dateTime: formatTime(date) });
        }
    }
    //console.log(ajaxUrlArr);
    var cjlRankArr = [], bullRankArr = [], bearRankArr = [], bullRankOnlyArr = [], bearRankOnlyArr = [], ajaxDateArr = [];
    var executeAjax = function () {
        if (ajaxes.length < 1) {
            return;
        }
        var sb = ajaxes.shift();
        var ajaxUrl = sb.ajaxurl;
        var ajaxDivId = sb.divId;
        var ajaxDate = sb.dateTime;
        $.ajax({
            async: false,
            url: ajaxUrl,
            success: function (response) {
                //删除队列中的第一个请求
                //如果队列中还有请求，就接着递归执行executeAjax函数，直到队列为空
                $(ajaxDivId).css("display", "none").html(response);

                var obj = $(ajaxDivId);
                var cjlRank = obj.find("table:eq(0) tr:last").find("td:eq(2)").text();
                if (cjlRank != '0') {
                    var bullRank = obj.find("table:eq(0) tr:last").find("td:eq(6)").text();
                    var bearRank = obj.find("table:eq(0) tr:last").find("td:eq(10)").text();
                    var bullRankOnly = obj.find("table:eq(2) tr:last").find("td:eq(2)").text();
                    var bearRankOnly = obj.find("table:eq(3) tr:last").find("td:eq(2)").text();
                    cjlRankArr.push(parseInt(cjlRank));
                    bullRankArr.push(parseInt(bullRank));
                    bearRankArr.push(parseInt(bearRank));
                    bullRankOnlyArr.push(parseInt(bullRankOnly));
                    bearRankOnlyArr.push(parseInt(bearRankOnly));
                    ajaxDateArr.push(ajaxDate);
                }
                if (ajaxes.length > 0) {
                    executeAjax();
                }
            }
        });
    };
    executeAjax();

    $('#highchart0').highcharts({
        title: {
            text: code + '数据成交量走势'
        },
        xAxis: {
            categories: ajaxDateArr,
            lineWidth: 1,
            tickLength: 1,//设置刻度线x轴长度
        },
        yAxis: {

        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
        series: [{
            name: '成交量走势',
            data: cjlRankArr
        }]

    });

    $('#highchart1').highcharts({
        title: {
            text: '多空持仓对比'
        },
        xAxis: {
            categories: ajaxDateArr,
            lineWidth: 1,
            tickLength: 1,//设置刻度线x轴长度
        },
        yAxis: {

        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
        series: [{
            name: '多头持仓排行',
            data: bullRankArr
        }, {
            name: '空头持仓排行',
            data: bearRankArr
        }]

    });

    $('#highchart2').highcharts({
        title: {
            text: '多空净持仓对比'
        },
        xAxis: {
            categories: ajaxDateArr,
            lineWidth: 1,
            tickLength: 1,//设置刻度线x轴长度
        },
        yAxis: {

        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
        series: [{
            name: '多头持仓排行',
            data: bullRankOnlyArr
        }, {
            name: '空头持仓排行',
            data: bearRankOnlyArr
        }]

    });
})();