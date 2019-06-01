// ==UserScript==
// @name         choice关键词搜索
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://app.jg.eastmoney.com/NewsData/GetNewsBySearch.do*
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    setTimeout(function(){
        $("body").append("<div id='json2'></div>")
        var pickDateArray = [];
        var pickFromArray = [];
        var pickTitleArray = [];
        var pickUrlArray = [];

        $(".obj .si2").find("li").each(function(index,obj){
            $(obj).find(".si1 .type-string").each(function(index,obj){
                if($(obj).text()!==""){
                    pickDateArray.push($(obj).text().replace("\"","").replace("\"","").replace(/\d{4}-/g, ''));
                }
            });
            $(obj).find(".si2 .type-string").each(function(index,obj){
                if($(obj).text()!==""){
                    pickFromArray.push($(obj).text().replace("\"","").replace("\"",""));
                }
            });
            $(obj).find(".si5 .type-string").each(function(index,obj){
                if($(obj).text()!==""){
                    pickTitleArray.push($(obj).text().replace("\"","").replace("\"",""));
                }
            });
            $(obj).find("li:last a").each(function(index,obj){
                if($(obj).text()!==""){
                    pickUrlArray.push($(obj).text().replace("\"","").replace("\"",""));
                }
            });
        });
        var pickChannelName = $(".obj .si1 .i1 .obj .si4").eq(0).find(".type-string").eq(0).text().replace("\"","").replace("\"","");
        $("#json2").empty().append("<h2 style='margin-left:30px'>包含"+pickChannelName+"</h2>");

        $("#json2").append("<div id='news'></div>");
        $.each(pickDateArray,function(index,obj){
            if(index%2 ==0){
                $("#news").append("<p style='overflow:hidden; background-color:#EFEFEF;height:30px; line-height:30px; margin:0px 0px 0px 0px; padding-left:30px;'><span style='float:left;width:55px; text-align:left'><span style='float:right; margin-right:10px'>"+pickDateArray[index]+"</span></span> <a href="+pickUrlArray[index]+" target='_blank'>"+pickTitleArray[index]+"</a></p>");
            }else{
                $("#news").append("<p style='overflow:hidden; height:30px; line-height:30px; margin:0px 0px 0px 0px; padding-left:30px;'><span style='float:left;width:55px; text-align:left'><span style='float:right; margin-right:10px'>"+pickDateArray[index]+"</span></span> <a href="+pickUrlArray[index]+" target='_blank'>"+pickTitleArray[index]+"</a></p>");
            }
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

        $("#json2").before("<div style='margin-top:20px;margin-left:30px'><input type='text' style='width:280px;height:25px' id='searchText'/ > <input type='button' value='提交' id='subText' /></div>");

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
        console.log(currentPage);

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
        $("#json2").before("<span style='position:absolute; top:65px; left:544px; width:200px; '><a href='"+hrefLast+"' style='text-decoration:none;'>上一页</a> <a href='"+hrefNext+"' style='text-decoration:none;'>下一页</a></span>");
        $("#json2").append("<span style='position:absolute; margin-bottom:15px; left:544px; width:200px; '><a href='"+hrefLast+"' style='text-decoration:none;'>上一页</a> <a href='"+hrefNext+"' style='text-decoration:none;'>下一页</a></span>");
    },1000);

})();
