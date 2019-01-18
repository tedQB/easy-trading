// ==UserScript==
// @name         期货每日持仓一览
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://data.eastmoney.com/futures/sh/data.html*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js

// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
  // Your code here...

   // $(".s6").next().remove();
   // $(".s6").remove();


    var $=jQuery;
    $("#mainContent").before("<div class='ss9' style=' height:230px; '></div>");
    $('.ss9').append('<div class="sjs js" id="sjs"><h5>上海期货交易所</h5><div value="AG">沪银</div><div value="AL">沪铝</div><div value="AU">沪金</div><div value="BU">沥青</div><div value="CU">沪铜</div><div value="FU">燃油</div><div value="HC">热卷</div><div value="NI">镍</div><div value="PB">沪铅</div><div value="RB">螺纹钢</div><div value="RU">橡胶</div><div value="SN">锡</div><div value="SP">纸浆</div><div value="ZN">沪锌</div></div>');
    $('.ss9').append('<div class="djs js" id="djs"><h5>大连期货交易所</h5><div value="A">豆一</div><div value="B">豆二</div><div value="C">玉米</div><div value="CS">玉米淀粉</div><div value="I">铁矿石</div><div value="J">焦炭</div><div value="JD">鸡蛋</div><div value="JM">焦煤</div><div value="L">塑料</div><div value="M">豆粕</div><div value="P">棕榈</div><div value="PP">聚丙烯</div><div value="V">PVC</div><div value="Y">豆油</div></div>');
    $('.ss9').append('<div class="zjs js" id="zjs"><h5>郑州期货交易所</h5><div value="ZC">郑煤</div><div value="WH">强麦</div><div value="TA">PTA</div><div value="SR">白糖</div><div value="SM">硅锰</div><div value="SF">硅铁</div><div value="RM">菜粕</div><div value="PM">普麦</div><div value="OI">菜油</div><div value="MA">甲醇</div><div value="JR">粳稻</div><div value="FG">玻璃</div><div value="CF">郑棉</div><div value="AP">苹果</div>');


    //刷新数据
    $('#sjs div').each(function(index,obj){
        var nameValSearch = $(obj);
        var nameText = nameValSearch.text();
        $(obj).append('<div class="ma"></div>');

        $.each(cc,function(index,obj1){
            if(obj1.value==nameValSearch.attr('value')){
                 $.each(obj1.data,function(index,obj2){
                      nameValSearch.find('.ma').append('<span mkt="069001005" name='+nameText+'>'+obj2[0]+'</span>');
                 });
            }

        });

    });
    $('#djs div').each(function(index,obj){
        var nameValSearch = $(obj);
        var nameText = nameValSearch.text();
        $(obj).append('<div class="ma"></div>');
        $.each(cc,function(index,obj1){
            if(obj1.value==nameValSearch.attr('value')){

                 $.each(obj1.data,function(index,obj2){
                      nameValSearch.find('.ma').append('<span mkt="069001007" name='+nameText+'>'+obj2[0]+'</span>');
                 });
            }

        });

    });
    $('#zjs div').each(function(index,obj){
        var nameValSearch = $(obj);
        var nameText = nameValSearch.text();
        $(obj).append('<div class="ma"></div>');
        $.each(cc,function(index,obj1){
            if(obj1.value==nameValSearch.attr('value')){

                 $.each(obj1.data,function(index,obj2){
                      nameValSearch.find('.ma').append('<span mkt="069001008" name='+nameText+'>'+obj2[0]+'</span>');
                 });
            }

        });

    });
    //绑定点击事件
    $('.js div').each(function(index,obj){

        var elem = $(obj);
        elem.hover(
            function(){
                $(this).addClass("hover");

            },
            function(){
               $(this).removeClass("hover");
            }
        );

      //http://datainterface.eastmoney.com/EM_DataCenter/JS.aspx?type=QHCC&sty=QHSYCC&stat=3&fd=2018-07-23&mkt=069001008&code=zc1808&sc=ZC&cb=callback&callback=callback&_=1532415034323
      //http://datainterface.eastmoney.com/EM_DataCenter/JS.aspx?type=QHCC&sty=QHSYCC&stat=3&fd=2018-07-23&mkt=069001008&code=zc1808&sc=ZC&cb=callback&callback=callback&_=1532415034325
        //timeline.html?ex=069001007&va=JD&ct=jd1901
        var elemList = elem.find('span');
        var changeLi = $(".IF").find("li")[2];

        for(var i=0;i<elemList.length;i++){
           (function(obj){
               obj.onclick = function(){
                   document.getElementById("PageNav").style.display = "none";
                   var sz = $(this).parent().parent();
                   var dataUrl = "http://datainterface.eastmoney.com/EM_DataCenter/JS.aspx?type=QHCC&sty=QHSYCC&stat=3&fd=" + document.getElementById('inputDate').value + "&mkt=" + $(this).attr('mkt') + "&code=" +$(this).text() + "&sc=" + sz.attr('value');
                   //更改顶部select选项
                   /*
                   $("#futures_exchange option").attr("selected", false);
                   $("#futures_exchange").find("option[value="+$(this).attr('mkt')+"]").attr("selected", true);
                   s.selected(a, { value: exchange });
                   $("#futures_variety option").attr("selected", false);
                   $("#futures_variety").find("option[value="+sz.attr('value')+"]").attr("selected", true);
                   */
                  // s.selected(b, { value: variety });
                   var url = "http://data.eastmoney.com/futures/sh/timeline.html?"+"ex="+ $(this).attr('mkt')+"&va="+ sz.attr('value')+"&ct="+$(this).text();
                   console.log($(changeLi).find("a").attr("href",url).attr("target","_blank").attr('onclick','*'));

                   FuturesJS.getData(dataUrl, "qhlhList", 'true', date);
                   $('#topTit').html($(this).attr('name')+" "+$(this).text() + "合约会员成交持仓龙虎榜");
                   sz.css("color","red").css("font-weight","bold");
                   //$("#futures_exchange option").attr("selected", false);
                   //$("#futures_exchange option[value="+$(this).attr('mkt')+"]").attr("selected", true);
                   return false;
               };
               $(obj).hover(
                   function(){
                       $(this).addClass("hover2");

                   },
                   function(){
                       $(this).removeClass("hover2");
                   }
               );
           })(elemList[i]);
        }

    });
  var GM_addStyle = GM_addStyle || function(css) {
    var style = document.createElement("style");
    style.type = "text/css";
    style.appendChild(document.createTextNode(css));
    document.getElementsByTagName("head")[0].appendChild(style);
  };

  GM_addStyle("\
   .sjs div,.djs div,.zjs div{\
    float:left;\
    width:80px;\
    cursor:pointer;\
    line-height:26px;\
    position:relative;\
  }\
  ");
  GM_addStyle("\
   .js{\
    margin:0px;\
  }\
  ");
  GM_addStyle("\
  .ss9 h5{\
    clear:both;\
    overflow:hidden;\
    margin:8px 0 5px 0;\
  }\
  ");

  GM_addStyle("\
  div.ma {\
    clear:both;\
    display:block;\
    position:absolute;\
    top:0px;\
    left:30px;\
    z-index:999;\
    display:none;\
    width:40px;\
    border:1px solid #98AFC1;\
  }\
  ");

  GM_addStyle("\
  .hover div.ma{\
    overflow:auto;\
    display:block;\
  }\
  ");
  GM_addStyle("\
  .ma span{\
    display:block;\
    background:#fff;\
    font-weight:normal;\
    color:#000;\
  }\
  ");
  GM_addStyle("\
  div.ma span.hover2 {\
    display:block;\
    background:#e5f3ff;\
    font-weight:normal;\
    color:#000;\
  }\
  ");

})();