// ==UserScript==
// @name         choice一级快捷新闻
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=S*
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @require      https://raw.githubusercontent.com/tedQB/easymoney/master/tampermonkey/category2.js?timestamp=35335435
// @grant        GM_addStyle


// ==/UserScript==

(function() {
    'use strict';

    //缓存框架--begin
    var config={
        debug  : true
    }
    function setCache(key,obj){
        var data = JSON.stringify(obj);
        var jsonData={"data":obj};
        if(config.debug){
            console.log("设置缓存数据："+data);
        }
        return localStorage.setItem(key, JSON.stringify(jsonData));
    }

    function getCache(key){
        if(!key){
            if(config.debug){
                console.log("key为空，key=【"+key+"】");
            }
            return "";
        }
        var jsonData=JSON.parse(localStorage.getItem(key));
        if(!jsonData){
            if(config.debug){
                console.log("【"+key+"】缓存的数据不存在");
            }
            return "";
        }
        if(config.debug){
            console.log("【"+key+"】获取到的缓存数据："+jsonData.data);
        }
        return jsonData.data;
    }


    function apartMinutes(date1,date2){
        var date3=date2 - date1;
        var minutes=Math.floor(date3/(60*1000));
        if(config.debug){
            console.log("数据已缓存时间："+minutes+"分钟");
        }
        return minutes;
    }

    var cache =  {
        getCache: getCache,
        setCache: setCache,
        configCache: function(obj) {
            $.extend(config, obj);
        }
    };

    $.extend($, cache);
    //缓存框架--end

    setTimeout(function(){
        var pickDateArray = [];
        var pickFromArray = [];
        var pickTitleArray = [];
        var pickUrlArray = [];
        $("body").append("<div id='json2'></div>")
        $(".obj .si3").find("li").each(function(index,obj){
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
        var pickChannelName = $(".obj .si2").eq(0).find(".type-string").text().replace("\"","").replace("\"","");
        $("#json2").css("margin-left","100px").empty().append("<h2 style='margin-left:30px' class='tit'>"+pickChannelName+"</h2>");
        $("#json2").append("<div id='news'></div>");
        $.each(pickDateArray,function(index,obj){
            if(index%2 ==0){
                $("#news").append("<p style='overflow:hidden; background-color:#EFEFEF;height:30px; line-height:30px; margin:0px 0px 0px 0px; padding-left:30px;'><span style='float:left;width:53px; text-align:left'><span style='float:right; margin-right:10px'>"+pickDateArray[index]+"</span></span> <a href="+pickUrlArray[index]+" target='_blank'>"+pickTitleArray[index]+"</a></p>");
            }else{
                $("#news").append("<p style='overflow:hidden; height:30px; line-height:30px; margin:0px 0px 0px 0px; padding-left:30px;'><span style='float:left;width:53px; text-align:left'><span style='float:right; margin-right:10px'>"+pickDateArray[index]+"</span></span> <a href="+pickUrlArray[index]+" target='_blank'>"+pickTitleArray[index]+"</a></p>");
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

        $("#json2").before("<div style='margin-top:20px;margin-left:105px'><input type='text' style='width:280px;height:25px' id='searchText'/ > <input type='button' value='提交' id='subText' /></div>");

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
        $("#json2").before("<span style='position:absolute; top:65px; left:544px; width:200px;'><a href='"+hrefLast+"' style='text-decoration:none;'>上一页</a> <a href='"+hrefNext+"' style='text-decoration:none;'>下一页</a></span>");


        var urlTextHead = "<div class='tree'><ul class='inner'>";
        var urlTextFoot = "</ul></div>";
        var urlTextBody = [];

        for(var i in catejson){
            if(catejson[i].constructor === Object){
                urlTextBody.push(`<li class=''><a href='#' class='sd'>${i}</a><ul class='close'>`);
                for(var j in catejson[i]){
                    if(catejson[i][j].indexOf("F")!=-1){
                        urlTextBody.push(`<li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=${catejson[i][j]}&limit=8&pageIndex=1'>${j}</a></li>`);
                    }else{
                        urlTextBody.push(`<li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=${catejson[i][j]}&pageIndex=1&limit=100&sort=date&order=desc'>${j}</a></li>`);
                    }
                }
                urlTextBody.push(`</ul></li>`);
            }else{
                if(catejson[i].indexOf("F")!=-1){
                    urlTextBody.push(`<li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=${catejson[i]}&limit=8&pageIndex=1'>${i}</a></li>`);
                }else{
                    urlTextBody.push(`<li><a href='http://app.jg.eastmoney.com/NewsData/GetNewsById.do?id=${catejson[i]}&pageIndex=1&limit=100&sort=date&order=desc'>${i}</a></li>`);
                }
            }
        }

        var treeText = urlTextHead+urlTextBody.join("")+urlTextFoot;

        $("#json2").append(treeText);

        $("#json2").append("<span style='position:absolute; margin-bottom:15px; left:544px; width:200px;'><a href='"+hrefLast+"' style='text-decoration:none;'>上一页</a> <a href='"+hrefNext+"' style='text-decoration:none;'>下一页</a></span>");
        $('body').addClass('open');

        $(".tree li a").css("text-decoration","none").css("display","block").css("height","30px").css("line-height","30px").css("padding-left","10px");
        $('.tree .sd').each(function(index,obj){
            var classNameT = $(obj).attr("class") + index;
            if($.getCache(classNameT)=='open'){
                $(obj).next('.close').addClass('open')
            }

            $(obj).click(function(){
                var ds = $(this).next('.close');
                var keyName = 'sd'+index;
                if(ds.hasClass("open")){
                    ds.removeClass("open");
                    $.setCache(keyName,'close');
                } else {
                    ds.addClass("open");
                    $.setCache(keyName,'open');
                }
                console.log($('.inner').height())
            })
        })
        var tit = $('.tit').text();
        $('.tree li a').each(function(index,obj){
            if($(obj).text()==tit){
                $(obj).addClass('link')
            }
        })

        addStyle();
    },100);


    function addStyle(){
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
