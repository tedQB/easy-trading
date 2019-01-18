// ==UserScript==
// @name         choice面板汇总新闻
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=F*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function(){
        var pickDataArray = [];
        var pickBkNameArray = [];
        var pickDateArray = [];
        var pickFromArray = [];
        var pickTitleArray = [];
        var pickUrlArray = [];

        $(".obj .si3").find("ul li").each(function(index,obj){

            var tempObj = $(obj);
            tempObj.find(".si1 .type-string").each(function(index,obj){
                if($(obj).prev().text()=="NodeName"){
                    if($(obj).text()!==""){
                        pickBkNameArray.push($(obj).text().replace("\"","").replace("\"",""));
                    }
                    //抓取时间
                    var pickTempDateArray = [];
                    var pickTempFromArray = [];
                    var pickTempTitleArray = [];
                    var pickTempUrlArray = [];

                    tempObj.find(".si2 li").each(function(index,obj){
                        $(obj).find(".si1 .type-string").each(function(index,obj){
                            if($(obj).text()!==""){
                                pickTempDateArray.push($(obj).text().replace("\"","").replace("\"","").replace(/\d{4}-/g, ''));
                            }
                        });
                        $(obj).find(".si2 .type-string").each(function(index,obj){
                            if($(obj).text()!==""){
                                pickTempFromArray.push($(obj).text().replace("\"","").replace("\"",""));
                            }
                        });
                        $(obj).find(".si5 .type-string").each(function(index,obj){
                            if($(obj).text()!==""){
                                pickTempTitleArray.push($(obj).text().replace("\"","").replace("\"",""));
                            }
                        });
                        $(obj).find("li:last a").each(function(index,obj){
                            if($(obj).text()!==""){
                                pickTempUrlArray.push($(obj).text().replace("\"","").replace("\"",""));
                            }
                        });
                    });
                    pickDateArray.push(pickTempDateArray);
                    pickFromArray.push(pickTempFromArray);
                    pickTitleArray.push(pickTempTitleArray);
                    pickUrlArray.push(pickTempUrlArray);
                }
            });
        });
       var pickChannelName = $(".obj .si2").eq(0).find(".type-string").text().replace("\"","").replace("\"","");

        $("#json").css("margin-left","100px").empty().append("<h2>F888019 政府聚合 </h2>");
        $("#json").append("<div id='news'></div>");

        console.log(pickBkNameArray.length);
        var fakeArr = new Array(parseInt(pickBkNameArray.length/2));

        $.each(fakeArr,function(index,obj){
             var tempWrap = 'wrap'+index;
             var num1 = index*2;    //0,1|2,3|4,5|6,7
             var num2 = num1+1;
             $("#news").append("<div class="+tempWrap+" style='overflow:hidden; '></div>");
             $("."+tempWrap).append("<div class='leftcol' style='float:left; width:660px; overflow:hidden; margin-right:5px; '><h3 style='margin-left:20px;'>"+pickBkNameArray[num1]+"</h3><div class='cols cont"+num1+"'></div></div>");
             $("."+tempWrap).append("<div class='rightcol' style='float:left; width:660px; overflow:hidden;  '><h3 style='margin-left:10px;'>"+pickBkNameArray[num2]+"</h3><div class='cols cont"+num2+"'></div></div>");

        });

        $.each(pickDateArray,function(index1,obj){
            var tempCon = '.cont'+index1;

           $.each(obj,function(index2,objArr){
                if(index2%2 ==0){
                    $(tempCon).append("<p style='overflow:hidden; background-color:#EFEFEF;height:30px; line-height:30px; margin:0px 0px 0px 0px; padding-left:20px;'><span style='float:left;width:50px; text-align:left'>"+pickDateArray[index1][index2]+"</span> <a href="+pickUrlArray[index1][index2]+" target='_blank'>"+pickTitleArray[index1][index2]+"</a></p>");
                }else{
                    $(tempCon).append("<p style='overflow:hidden; height:30px; line-height:30px; margin:0px 0px 0px 0px; padding-left:20px;'><span style='float:left;width:50px; text-align:left'>"+pickDateArray[index1][index2]+"</span> <a href="+pickUrlArray[index1][index2]+" target='_blank'>"+pickTitleArray[index1][index2]+"</a></p>");
                }

            });



        });

        $("body").css("font-size","14px").css("margin","0px");

        $("#news a").css("color","#000").css("text-decoration","none");
        $("#news a").hover(
            function(){
                $(this).css("text-decoration","underline").css("color","#425bff");
            },
            function(){
                $(this).css("color","#000").css("text-decoration","none");
            }
        );



        $(".status").hide();

        /*搜索框*/

        $("#json").before("<div style='margin-top:20px;margin-left:100px'><input type='text' style='width:280px;height:25px' id='searchText'/ > <input type='button' value='提交' id='subText' /></div>");

        $("#subText").on("click",function(){
            window.open("http://app.jg.eastmoney.com/NewsData/GetNewsBySearch.do?types=&text='"+$('#searchText').val()+"'&title=&source=&pageIndex=1&limit=100&sort=date&order=desc");
        });

        $(document).keypress(function(event){
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if(keycode == '13'){
                window.open("http://app.jg.eastmoney.com/NewsData/GetNewsBySearch.do?types=&text='"+$('#searchText').val()+"'&title=&source=&pageIndex=1&limit=100&sort=date&order=desc");
            }
        });

        /*生成页码*/
        function GetRequest() {
            var url = location.search; //获取url中"?"符后的字串
            var theRequest = {};
            if (url.indexOf("?") != -1) {
                var str = url.substr(1);
                var strs = str.split("&");
                for(var i = 0; i < strs.length; i ++) {
                    theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
                }
            }
            return theRequest;
        }
        var currentPage = parseInt(GetRequest().pageIndex);

        function changeURLArg(url,arg,arg_val){
            var pattern=arg+'=([^&]*)';
            var replaceText=arg+'='+arg_val;
            if(url.match(pattern)){
                var tmp='/('+ arg+'=)([^&]*)/gi';
                tmp=url.replace(eval(tmp),replaceText);
                return tmp;
            }else{
                if(url.match('[\?]')){
                    return url+'&'+replaceText;
                }else{
                    return url+'?'+replaceText;
                }
            }
        }
        var hrefNext = changeURLArg(window.location.href,'pageIndex',currentPage+1);
        var hrefLast = changeURLArg(window.location.href,'pageIndex',currentPage-1);
        $("#json").before("<span style='position:absolute; top:65px; left:544px; width:200px; '><a href='"+hrefLast+"' style='text-decoration:none;'>上一页</a> <a href='"+hrefNext+"' style='text-decoration:none;'>下一页</a></span>");

      //树形模块
      var urlText= "<ul class='tree' style='position:fixed; top:20px; left:0px; width:100px; height:100%; background:#fff;  margin-left:0px;'>"
        +"<li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888005001&pageIndex=1&limit=100&sort=date&order=desc'>全部新闻</a></li>"
        +"<li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888005003&pageIndex=1&limit=100&sort=date&order=desc'>财经新闻</a></li>"
        +"<li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=F888006&limit=8&pageIndex=1'>媒新闻板块</a></li>"
        +"<li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=F888019&limit=8&pageIndex=1'>政府新闻板块</a>"
        +" <ul><li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888019002&pageIndex=1&limit=50&sort=date&order=desc'>国务院</a></li>"
        +"  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888019003&pageIndex=1&limit=50&sort=date&order=desc'>发改委</a></li>"
        +"  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888019004&pageIndex=1&limit=50&sort=date&order=desc'>国资委</a></li>"
        +"  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888019005&pageIndex=1&limit=50&sort=date&order=desc'>央行</a></li>"
        +"  <li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S888019007&pageIndex=1&limit=50&sort=date&order=desc'>工信部</a></li>"
        +" </ul></li>"
        +"</ul>";
        $("#json").append(urlText);
        $(".tree li a").css("text-decoration","none").css("display","block").css("height","30px").css("line-height","30px").css("padding-left","10px");

    },200);


    // Your code here...
})();