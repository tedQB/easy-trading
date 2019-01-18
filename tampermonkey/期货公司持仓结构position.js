// ==UserScript==
// @name         期货公司持仓结构position
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://data.eastmoney.com/futures/sh/position.html*
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
  var GM_addStyle = GM_addStyle || function(css) {
    var style = document.createElement("style");
    style.type = "text/css";
    style.appendChild(document.createTextNode(css));
    document.getElementsByTagName("head")[0].appendChild(style);
  };
    var $ = jQuery;
   // $(".s6").next().remove();
   // $(".s6").remove();
    $("#mainContent").before("<div class='s7'></div>");
    $('.s7').append('<div value="80102901">永安期货</div><div value="80055521">华泰期货</div><div value="80050220">中信期货</div><div value="80101065">国泰期货</div><div value="80103797">银河期货</div><div value="80103744">光大期货</div><div value="80071840">海通期货</div><div value="80052362">广发期货</div><div value="80004835">申银万国期货</div><div value="80108224">东证期货</div><div value="80091157">浙商期货</div><div value="80066669">国投安信期货</div><div value="80066668">中期期货</div><div value="80096453">中国国际期货</div><div value="80080089">南华期货</div><div value="80098340">中信建投期货</div><div value="80103804">瑞达期货</div><div value="80055517">招商期货</div><div value="80095998">国信期货</div><div value="80098329">中粮期货</div><div value="80104005">华信期货</div><div value="80066672">长江期货</div><div value="80030099">新湖期货</div><div value="80044916">弘业期货</div><div value="80102903">鲁证期货</div><div value="80061244">宏源期货</div><div value="80108195">上海中期</div><div value="80103802">兴证期货</div><div value="80107997">东航期货</div><div value="80055516">五矿经易期货</div><div value="80039956">金瑞期货</div><div value="80101049">建信期货</div><div value="80107993">信达期货</div><div value="80108049">中金期货</div><div value="80069367">格林期货</div><div value="80102887">东海期货</div><div value="80102904">一德期货</div><div value="80004615">国贸期货</div><div value="80010572">平安期货</div><div value="80023426">中大期货</div><div value="80055436">大有期货</div><div value="80104015">大地期货</div><div value="80021496">华龙期货</div><div value="80066666">国元期货</div><div value="80104007">中投期货</div><div value="80108375">国海良时期货</div><div value="80104012">新纪元期货</div><div value="80107843">宝城期货</div><div value="80102927">国联期货</div><div value="80108373">民生期货</div><div value="80108185">英大期货</div><div value="80108203">中原期货</div><div value="80108379">安粮期货</div><div value="80114350">混沌天成</div><div value="80128239">中融汇信</div><div value="80108377">西部期货</div><div value="80108051">徽商期货</div><div value="80058162">华安期货</div><div value="80103599">瑞奇期货</div><div value="80108374">中衍期货</div><div value="80055522">金源期货</div><div value="80101066">东吴期货</div><div value="80009079">云晨期货</div><div value="80108400">广州期货</div><div value="80078479">恒泰期货</div><div value="80108386">山金期货</div><div value="80074415">锦泰期货</div><div value="80055515">海航期货</div><div value="80373309">天风期货</div><div value="80075388">中财期货</div><div value="80108192">华联期货</div><div value="80024680">倍特期货</div><div value="80020521">兴业期货</div><div value="80107735">大陆期货</div><div value="80019274">美尔雅期货</div><div value="80107995">华融期货</div><div value="80102946">国金期货</div><div value="80107733">红塔期货</div><div value="80053800">金石期货</div><div value="80108093">华金期货</div><div value="80103644">中辉期货</div><div value="80107031">冠通期货</div><div value="80055520">神华期货</div><div value="80108197">福能期货</div><div value="80107032">南证期货</div><div value="80027560">中钢期货</div><div value="80108370">道通期货</div><div value="80108087">西南期货</div><div value="80108678">华鑫期货</div><div value="80108378">九州期货</div><div value="80107731">华西期货</div><div value="80066675">首创期货</div><div value="80101060">新世纪期货</div><div value="80104007">中投期货</div><div value="80052272">金汇期货</div><div value="80066665">浙石期货</div><div value="80107847">东方期货</div><div value="80108070">东兴期货</div><div value="80108177">国富期货</div><div value="80007037">创元期货</div><div value="80103748">渤海期货</div><div value="80108385">华创期货</div><div value="80104009">大越期货</div><div value="80128238">中银国际期货</div><div value="80104013">乾坤期货</div><div value="80108179">长安期货</div><div value="80055499">盛达期货</div><div value="80103800">金元期货</div><div value="80134835">第一创业期货</div><div value="80055519">中航期货</div><div value="80100056">国都期货</div><div value="80103801">中天期货</div><div value="80108168">财达期货</div><div value="80108380">金信期货</div><div value="80108200">大通期货</div><div value="80066674">摩根大通期货</div><div value="80106526">鑫鼎盛期货</div><div value="80057675">天利期货</div><div value="80108191">新晟期货</div><div value="80076361">恒银期货</div><div value="80108178">金鹏期货</div><div value="80066673">德盛期货</div><div value="80108218">招金期货</div><div value="80141254">瑞龙期货</div><div value="80108180">东亚期货</div><div value="80068441">江海汇鑫期货</div><div value="80055497">津投期货</div><div value="80045628">东华期货</div><div value="80107034">和融期货</div><div value="80108055">集成期货</div><div value="80107846">国盛期货</div><div value="80108390">京都期货</div><div value="80107732">晟鑫期货</div><div value="80066667">良运期货</div><div value="80058848">华闻期货</div><div value="80108653">海证期货</div><div value="80093548">天富期货</div><div value="80108186">天鸿期货</div><div value="80108169">和合期货</div><div value="80108171">三立期货</div><div value="80108095">汇金期货</div><div value="80108383">中州期货</div>');

    function byId(id){
      return document.getElementById(id);

    }
     $('.s7 div').each(function(index,obj){
       $(obj).live('click',function(){
           // url: "http://datainterface.eastmoney.com/EM_DataCenter/JS.aspx?type=QHCC&sty=QHSYCC&stat=4" + "&mkt=" + a[a.selectedIndex].value + "&sc=" + c[c.selectedIndex].value + "&cmd=" + b[b.selectedIndex].value + "&fd=" + $(inputDate).value + "&name=1&cb=callback",
           $(obj).css("color","red").css("font-weight","bolder");
           $.ajax({
                scriptCharset: "utf-8",
                url: "http://datainterface.eastmoney.com/EM_DataCenter/JS.aspx?type=QHCC&sty=QHSYCC&stat=4" + "&mkt=" + $("#futures_exchange option:selected").val()+ "&sc=" + $("#futures_variety option:selected").val() + "&cmd=" + $(this).attr('value') + "&fd=" +$("#inputDate").val() + "&name=1&cb=callback",
                dataType: "jsonp",
                jsonpCallback: "callback",
                beforeSend: function () {
                    // 遮罩层
                    byId('divRef').style.top = $('#mainContent').position().top + "px";
                    byId('divRef').style.left = $('#mainContent').position().left + "px";
                    byId('divRef').style.height = byId('mainContent').offsetHeight + "px";
                    byId('divRef').style.width = byId('mainContent').offsetWidth + "px";
                    byId('divRef').style.display = "block";
                    // 更改网页标题

                    var titStr = $(obj).text() + $("#futures_contract option:selected").text();
                    if (document.all) {
                        byId('topTit').innerText = titStr + "合约建仓过程分析表持仓结构分析";
                    } else {
                        byId('topTit').textContent = titStr + "合约建仓过程分析表持仓结构分析";
                    }
                    document.title = titStr + "合约建仓过程分析表持仓结构分析 _ 数据中心 _ 东方财富网";

                    // 删除原有数据
                    var childs = byId('tabBody').children || byId('tabBody').childNodes;
                    while (childs.length > 0) {
                        byId('tabBody').removeChild(childs[childs.length - 1]);
                    }
                },
                success: function (data) {
                    console.log(data);
                    if (data[0].stats == undefined) {
                        for (var i = 0; i < data.length; i++) {
                            var tr = $("#tabBody")[0].insertRow();
                            var cdata = data[i].split(',');
                            //　加载table
                            // 合约
                            td1 = tr.insertCell(-1);
                            td1.innerHTML = "<a href=\"http://quote.eastmoney.com/qihuo/" + cdata[0] + ".html\" target=\"_blank\">" + cdata[0] + "</a>";
                            // 结算价（元）
                            td2 = tr.insertCell(-1);
                            td2.innerHTML = cdata[1] || "&nbsp;";
                            td2.className = "IFbr";
                            // 成交量
                            td3 = tr.insertCell(-1);
                            td3.innerHTML = cdata[2] == 0 ? "&nbsp;" : cdata[2];
                            // 成交情况增减
                            td4 = tr.insertCell(-1);
                            td4.innerHTML = cdata[3] == 0 ? "&nbsp;" : "<span class=\"" + getColor(cdata[3]) + "\">" + cdata[3] + "</span>";
                            td4.className = "IFbr";
                            // 多单量
                            td5 = tr.insertCell(-1);
                            td5.innerHTML = cdata[4] == 0 ? "&nbsp;" : cdata[4];
                            // 多头持仓增减
                            td6 = tr.insertCell(-1);
                            td6.innerHTML = cdata[5] == 0 ? "&nbsp;" : "<span class=\"" + getColor(cdata[5]) + "\">" + cdata[5] + "</span>";
                            td6.className = "IFbr";
                            // 空单量
                            td7 = tr.insertCell(-1);
                            td7.innerHTML = cdata[6] == 0 ? "&nbsp;" : cdata[6];
                            // 多头持仓增减
                            td8 = tr.insertCell(-1);
                            td8.innerHTML = cdata[7] == 0 ? "&nbsp;" : "<span class=\"" + getColor(cdata[7]) + "\">" + cdata[7] + "</span>";
                            td8.className = "IFbr";
                            // 净多单
                            td9 = tr.insertCell(-1);
                            td9.innerHTML = cdata[8] == 0 ? "&nbsp;" : cdata[8];
                            // 净空单
                            td10 = tr.insertCell(-1);
                            td10.className = "IFbr";
                            td10.innerHTML = cdata[9] == 0 ? "&nbsp;" : cdata[9];
                        }
                    } else {
                        var trs = $("#tabBody").insertRow();
                        td = trs.insertCell(-1);
                        td.innerHTML = "没有相关数据...";
                        td.className = "IFbr";
                        td.colSpan = "10";
                    }
                },
                error: function () {
                    alert("获取数据失败！");
                },
                complete: function () {
                    // 遮罩层
                    byId('divRef').style.display = "none";
                }
            });

       });


    });


    function searchData() {

        }




  GM_addStyle("\
  .s7 {\
    height:270px;\
    overflow:hidden;\
  }\
  ");

  GM_addStyle("\
   .s7 div{\
    float:left;\
    width:80px;\
    cursor:pointer;\
    height:18px;\
    line-height:18px;\
  }\
  ");


})();