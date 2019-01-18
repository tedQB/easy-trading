// ==UserScript==
// @name         期货公司建仓过程timeline
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://data.eastmoney.com/futures/sh/timeline.html*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
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

	jQuery.extend(jQuery, cache);
 //缓存框架--end
    //
  var GM_addStyle = GM_addStyle || function(css) {
    var style = document.createElement("style");
    style.type = "text/css";
    style.appendChild(document.createTextNode(css));
    document.getElementsByTagName("head")[0].appendChild(style);
  };
    var $ = jQuery;
   // $(".s6").next().remove();
   // $(".s6").remove();
    $("#mainContent").before("<div class='bt'><button id='mark'>记录</button><span>多头数目:</span><span id='longNum' style='color:red;font-weight:bolder'></span><span>空头数目:</span><span id='shortNum' style='color:green;font-weight:bolder'></span></div><div class='s7'></div>");
    $("#mainContent").before("<div class='bt2'><button id='clean'>整理</button></div>")
    $("#mainContent").before("<div class='bt3'><input type='text' style='width:60px' id='jiage' /><button id='cal'>计算</button></div>")
    $("#mainContent").before("<div class='bt4'>日期<input type='text' style='width:70px' id='riqi' /></div>")
    $("#mainContent").before("<div class='bt5'>采集数据<input type='checkbox' id='caiji' /></div>")
    $("#mainContent").before("<div class='bt6'><a href='http://localhost:8080/school2/jiesebang/app3.php?future="+$('#futures_contract').val()+"&num=true' target='_blank'>全景数据</a></div>")

    $('.s7').append('<div value="80102901">永安期货</div><div value="80055521">华泰期货</div><div value="80050220">中信期货</div><div value="80101065">国泰期货</div><div value="80103797">银河期货</div><div value="80103744">光大期货</div><div value="80071840">海通期货</div><div value="80052362">广发期货</div><div value="80004835">申银万国期货</div><div value="80108224">东证期货</div><div value="80091157">浙商期货</div><div value="80066669">国投安信期货</div><div value="80066668">中期期货</div><div value="80096453">中国国际期货</div><div value="80080089">南华期货</div><div value="80098340">中信建投期货</div><div value="80103804">瑞达期货</div><div value="80055517">招商期货</div><div value="80095998">国信期货</div><div value="80098329">中粮期货</div><div value="80104005">华信期货</div><div value="80066672">长江期货</div><div value="80030099">新湖期货</div><div value="80044916">弘业期货</div><div value="80102903">鲁证期货</div><div value="80061244">宏源期货</div><div value="80108195">上海中期</div><div value="80103802">兴证期货</div><div value="80107997">东航期货</div><div value="80055516">五矿经易期货</div><div value="80039956">金瑞期货</div><div value="80101049">建信期货</div><div value="80107993">信达期货</div><div value="80108049">中金期货</div><div value="80069367">格林期货</div><div value="80102887">东海期货</div><div value="80102904">一德期货</div><div value="80004615">国贸期货</div><div value="80010572">平安期货</div><div value="80023426">中大期货</div><div value="80055436">大有期货</div><div value="80104015">大地期货</div><div value="80021496">华龙期货</div><div value="80066666">国元期货</div><div value="80104007">中投期货</div><div value="80108375">国海良时期货</div><div value="80104012">新纪元期货</div><div value="80107843">宝城期货</div><div value="80102927">国联期货</div><div value="80108373">民生期货</div><div value="80108185">英大期货</div><div value="80108203">中原期货</div><div value="80108379">安粮期货</div><div value="80114350">混沌天成</div><div value="80128239">中融汇信</div><div value="80108377">西部期货</div><div value="80108051">徽商期货</div><div value="80058162">华安期货</div><div value="80103599">瑞奇期货</div><div value="80108374">中衍期货</div><div value="80055522">金源期货</div><div value="80101066">东吴期货</div><div value="80009079">云晨期货</div><div value="80108400">广州期货</div><div value="80078479">恒泰期货</div><div value="80108386">山金期货</div><div value="80074415">锦泰期货</div><div value="80055515">海航期货</div><div value="80373309">天风期货</div><div value="80075388">中财期货</div><div value="80108192">华联期货</div><div value="80024680">倍特期货</div><div value="80020521">兴业期货</div><div value="80107735">大陆期货</div><div value="80019274">美尔雅期货</div><div value="80107995">华融期货</div><div value="80102946">国金期货</div><div value="80107733">红塔期货</div><div value="80053800">金石期货</div><div value="80108093">华金期货</div><div value="80103644">中辉期货</div><div value="80107031">冠通期货</div><div value="80055520">神华期货</div><div value="80108197">福能期货</div><div value="80107032">南证期货</div><div value="80027560">中钢期货</div><div value="80108370">道通期货</div><div value="80108087">西南期货</div><div value="80108678">华鑫期货</div><div value="80108378">九州期货</div><div value="80107731">华西期货</div><div value="80066675">首创期货</div><div value="80101060">新世纪期货</div><div value="80104007">中投期货</div><div value="80052272">金汇期货</div><div value="80066665">浙石期货</div><div value="80107847">东方期货</div><div value="80108070">东兴期货</div><div value="80108177">国富期货</div><div value="80007037">创元期货</div><div value="80103748">渤海期货</div><div value="80108385">华创期货</div><div value="80104009">大越期货</div><div value="80128238">中银国际期货</div><div value="80104013">乾坤期货</div><div value="80108179">长安期货</div><div value="80055499">盛达期货</div><div value="80103800">金元期货</div><div value="80134835">第一创业期货</div><div value="80055519">中航期货</div><div value="80100056">国都期货</div><div value="80103801">中天期货</div><div value="80108168">财达期货</div><div value="80108380">金信期货</div><div value="80108200">大通期货</div><div value="80066674">摩根大通期货</div><div value="80106526">鑫鼎盛期货</div><div value="80057675">天利期货</div><div value="80108191">新晟期货</div><div value="80076361">恒银期货</div><div value="80108178">金鹏期货</div><div value="80066673">德盛期货</div><div value="80108218">招金期货</div><div value="80141254">瑞龙期货</div><div value="80108180">东亚期货</div><div value="80068441">江海汇鑫期货</div><div value="80055497">津投期货</div><div value="80045628">东华期货</div><div value="80107034">和融期货</div><div value="80108055">集成期货</div><div value="80107846">国盛期货</div><div value="80108390">京都期货</div><div value="80107732">晟鑫期货</div><div value="80066667">良运期货</div><div value="80058848">华闻期货</div><div value="80108653">海证期货</div><div value="80093548">天富期货</div><div value="80108186">天鸿期货</div><div value="80108169">和合期货</div><div value="80108171">三立期货</div><div value="80108095">汇金期货</div><div value="80108383">中州期货</div>');

    $('.s7 div').each(function(index,obj){
        $(obj).wrapInner("<span class='cifcoName'></span>")
        $(obj).append("<span class='o1'></span><span class='o2'></span><span><span class='riqi'></span>")
    })
    //http://datainterface.eastmoney.com/EM_DataCenter/JS.aspx?type=QHCC&sty=QHSYCC&stat=4&mkt=069001005&sc=AG&cmd=80102901&code=ag1812&name=2&cb=callback&callback=callback&_=1531572639843
    //http://datainterface.eastmoney.com/EM_DataCenter/JS.aspx?type=QHCC&sty=QHSYCC&stat=4&mkt=[object%20Object]&sc=[object%20Object]&cmd=80052362&code=[object%20Object]&name=2&cb=callback&callback=callback&_=1531574609181
    function byId(id){
      return document.getElementById(id);

    }
    // url: "http://datainterface.eastmoney.com/EM_DataCenter/JS.aspx?type=QHCC&sty=QHSYCC&stat=4" + "&mkt=" + a[a.selectedIndex].value + "&sc=" + b[b.selectedIndex].value + "&cmd=" + d[d.selectedIndex].value + "&code=" + c[c.selectedIndex].value + "&name=2&cb=callback",

    $(document).ready(function(){
        $(document).bind("contextmenu",function(e){
            return false;
        });
        $('.IFfr').find("td:first").attr("colspan","3");
        $('.IFfr').find("td:first").append("<button id='getEndPrice'>获取收盘价</button><button id='sendEndPrice'>提交收盘价</button><button id='cals'>浮盈浮亏</button>");
        $('.IFfr').next().html('<td>日期</td><td>收盘价</td><td class="IFbr">结算价（元）</td><td>成交量</td><td class="IFbr">增减</td><td>多单量</td><td>持仓均价</td><td class="IFbr">增减</td><td>空单量</td><td>持仓均价</td><td class="IFbr">增减</td><td>净多单</td><td class="IFbr">净空单</td>')
    });

    var selectFname = $("#futures_contract").find("option:selected").attr('value');

    $('#clean').click(function(){
        $('.s7 div').each(function(index,obj){
            if($(obj).hasClass("red")||$(obj).hasClass("green")){ $(obj).show();}
            else $(obj).hide();
        })
    });

    $('#mark').click(function(){
         var keyArray = [];
         var longLen = [];
         var shortLen = [];
         $('.s7 div').each(function(index,obj){
             var keyVal = {};
             keyVal['value'] = $(obj).attr('value');
             keyVal['class'] = $(obj).attr('class');
             keyVal['o1'] = $(obj).find('.o1').html();
             keyVal['o2'] = $(obj).find('.o2').html();
             keyVal['riqi'] = $(obj).find('.riqi').html();

             if(keyVal['riqi']){
                 if($(obj).attr('class') == 'red'){ longLen.push($(obj).attr('class'));}
                 if($(obj).attr('class') =='green'){ shortLen.push($(obj).attr('class'));}
             }

             keyArray.push(keyVal);
         });
        var fName= "futuresDatas"+selectFname;
        $.setCache(fName,keyArray);
        $("#longNum").html(longLen.length);
        $("#shortNum").html(shortLen.length);
    })


    $('#cal').click(function(){
       var normal = parseInt($("#jiage").val())

       $('.s7 div').each(function(index,obj){
           var longOld = $(obj).find('.o1');
           var shortOld = $(obj).find('.o2');
           var longOldPrice = parseInt(longOld.html());
           var shortOldPrice = parseInt(shortOld.html());
           longOld.find('.tmp').html('');
           shortOld.find('.tmp').html('');
               //console.log(longOldPrice,shortOldPrice);
               if(longOldPrice!=0){
                   if(normal>longOldPrice){
                       longOld.append("<span class='tmp' style='color:red'>盈 "+String(normal-longOldPrice)+"</span>");
                   }else{
                       longOld.append("<span class='tmp' style='color:green'>亏 "+String(normal-longOldPrice)+"</span>");
                   }
               }
               if(shortOldPrice!=0){
                   if(normal>shortOldPrice){ //3400  空3452
                       shortOld.append("<span class='tmp' style='color:green'>亏 "+String(shortOldPrice-normal)+"</span>")
                   }else{
                       shortOld.append("<span class='tmp' style='color:red'>盈 "+String(shortOldPrice-normal)+"</span>")
                   }
               }
       });
    })

   var fName= "futuresDatas"+selectFname;
   var longLen1 = [];
   var shortLen1 = [];

    //**初始化渲染。

   $.each($.getCache(fName),function(index,obj){
       if(obj.class == 'red'){ longLen1.push(obj.class);}
       if(obj.class =='green'){ shortLen1.push(obj.class);}
       var s = $('.s7 div')[index];

       $(s).find(".o1").html(obj.o1);
       $(s).find(".o2").html(obj.o2);
       //if($(s).find(".riqi").html()){
       $(s).find(".riqi").html(obj.riqi);
       if($(s).find(".riqi").html()){
           $(s).addClass(obj.class);
       }

       //}
   })
    $("#longNum").html(longLen1.length);
    $("#shortNum").html(shortLen1.length);


    $('.s7 div').each(function(index,obj){

       $(obj).mousedown(function(e){
            if(3 == e.which){
               if($(obj).hasClass('red')){
                  $(obj).removeClass().addClass("green");
               }else if($(obj).hasClass('green')){
                  $(obj).removeClass().addClass("normal");
               }else if($(obj).hasClass('normal')){
                  $(obj).removeClass().addClass("green");
               }
            }
        });
       $(obj).live('click',function(){
            //console.log($("#futures_exchange").select(),$("#futures_variety").select(),$(this).attr('value'),$("#futures_contract").select());
             $(obj).removeClass().addClass("red");
             var elem = $(obj);
             $.ajax({
                scriptCharset: "utf-8",
                url: "http://datainterface.eastmoney.com/EM_DataCenter/JS.aspx?type=QHCC&sty=QHSYCC&stat=4" + "&mkt=" + $("#futures_exchange option:selected").val()+ "&sc=" + $("#futures_variety option:selected").val() + "&cmd=" + $(this).attr('value') + "&code=" + $("#futures_contract option:selected").val() + "&name=2&cb=callback",
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


                    var titStr = $(obj).find('.cifcoName').text();

                    if (document.all) {
                        byId('topTit').innerText = titStr + " 合约建仓过程分析表持仓结构分析";
                    } else {
                        byId('topTit').textContent = titStr + " 合约建仓过程分析表持仓结构分析";
                    }
                    document.title = titStr + " 合约建仓过程分析表持仓结构分析 _ 数据中心 _ 东方财富网";

                    // 删除原有数据
                    var childs = byId('tabBody').children || byId('tabBody').childNodes;
                    while (childs.length > 0) {
                        byId('tabBody').removeChild(childs[childs.length - 1]);
                    }
                },
                success: function (data) {
                    //console.log(data[44]); //2018-12-27,3422,129560,20463,91445,3434.60668468,6196,50999,3451.9715001,2350,0446,0

                    console.log(data);
                    console.log($('#caiji').is(':checked'));

                    if($('#caiji').is(':checked')){
                          $.post('http://localhost:8080/school2/jiesebang/collectData2.php',{
                              cifcoName:$(obj).find('.cifcoName').html(),
                              futureName:$('#futures_contract').val(),
                              datas:data

                          },function(){
                             console.log('ok');
                          })

                    }
                    var Tdata = data[0].split(',');//拉取当天最新的数据进行对比。
                    var riqi = String($('#riqi').val()); //按日期选择，精确选择日期数据。
                    var fetch = Array();

                    if(riqi){
                        $.each(data,function(index,obj){
                            if(obj.split(',')[0]===riqi){
                                fetch = obj;
                            }

                        })
                        var das = fetch.split(',');
                        elem.find(".o1").html((das[5] / 1).toFixed(0));
                        elem.find(".o2").html((das[8] / 1).toFixed(0));
                        elem.find(".riqi").html(das[0]);
                    }else{
                        elem.find(".o1").html((Tdata[5] / 1).toFixed(0));
                        elem.find(".o2").html((Tdata[8] / 1).toFixed(0));
                        elem.find(".riqi").html(Tdata[0]);
                    }



                    if (data[0].stats == undefined) {
                        byId("tabBody").innerHTML='';
                        $('#tabBody').attr("cifcoName",$(obj).find('.cifcoName').html());
                        for (var i = 0; i < data.length; i++) {
                            var tr = byId("tabBody").insertRow();
                            tr.className = "index"+i;
                            var cdata = data[i].split(',');
                            //　加载table
                            // 合约
                            var td0 = tr.insertCell(-1);
                            td0.innerHTML = cdata[0];

                            td1 = tr.insertCell(-1);
                            td1.innerHTML = '<input type="text" style="width:44px" class="send" futuredate='+cdata[0]+' futurename='+$("#futures_contract").val()+'>';

                            // 结算价（元）
                            td2 = tr.insertCell(-1);
                            td2.innerHTML = cdata[1] == 0 ? "&nbsp;" : (cdata[1] / 1).toFixed(0);
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
                            // 多头持仓持仓均价
                            td6 = tr.insertCell(-1);
                            td6.innerHTML = cdata[5] == 0 ? "&nbsp;" : '<span class="longprice">'+(cdata[5] / 1).toFixed(0);+'</span>'
                            // 多头持仓增减
                            td7 = tr.insertCell(-1);
                            td7.innerHTML = cdata[6] == 0 ? "&nbsp;" : "<span class=\"" + getColor(cdata[6]) + "\">" + cdata[6] + "</span>";
                            td7.className = "IFbr";
                            // 空单量
                            td8 = tr.insertCell(-1);
                            td8.innerHTML = cdata[7] == 0 ? "&nbsp;" : cdata[7];
                            // 空头持仓持仓均价
                            td9 = tr.insertCell(-1);
                            td9.innerHTML = cdata[8] == 0 ? "&nbsp;" : '<span class="shortprice">'+(cdata[8] / 1).toFixed(0)+'</span>';
                            // 多头持仓增减
                            td10 = tr.insertCell(-1);
                            td10.innerHTML = cdata[9] == 0 ? "&nbsp;" : "<span class=\"" + getColor(cdata[9]) + "\">" + cdata[9] + "</span>";
                            td10.className = "IFbr";
                            // 净多单
                            td11 = tr.insertCell(-1);
                            td11.innerHTML = cdata[10] == 0 ? "&nbsp;" : cdata[10];
                            // 净空单
                            td12 = tr.insertCell(-1);
                            td12.className = "IFbr";
                            td12.innerHTML = cdata[11] == 0 ? "&nbsp;" : cdata[11];
                            /*
                            // 收盘价
                            td13 = tr.insertCell(-1);
                            td13.className = "IFbr";
                            td13.innerHTML = cdata[11] == 0 ? "&nbsp;" : cdata[11];
                            */
                        }
                    } else {
                       // var tr = byId("tabBody").insertRow();
                        //td = tr.insertCell(-1);
                        $('#tabBody').html('没有相关数据...'+Math.floor(Math.random()*100+1));
                        //td.innerHTML = "没有相关数据...";
                        //td.className = "IFbr";
                        //td.colSpan = "12";
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

   $('.btn').click(function(){
      var selectFNameTemp = $("#futures_contract").find("option:selected").attr('value');
      var fName= "futuresDatas"+selectFNameTemp;
      if($.getCache(fName)){
          var longLen = [];
          var shortLen = [];
          $.each($.getCache(fName),function(index,obj){
              if(obj.class == 'red'){ longLen.push(obj.class);}
              if(obj.class =='green'){ shortLen.push(obj.class);}
              $($('.s7 div')[index]).addClass(obj.class);
          })
          $("#longNum").html(longLen.length);
          $("#shortNum").html(shortLen.length);
      }
   })

    //获取所有收盘价数据,参数，期货合约名称获取

    $("#getEndPrice").click(function(){
       $.get("http://localhost:8080/school2/jiesebang/getEndPrice.php",{
           futureName:$('#futures_contract').val()
       },function(data){

           var datas = eval('(' + data + ')');
           console.log(datas);
           $(".send").each(function(index,obj){
               $(obj).val(datas[$(obj).attr("futuredate")]);
           })
       })
    })

    //提交收盘价数据，参数 期货合约名称，合约日期
    $("#sendEndPrice").click(function(){
        var endPriceArr = [];
        $(".send").each(function(index,obj){
            //console.log(index,obj);
            var Temp = {};
            Temp.futureDate = $(obj).attr("futuredate");

            Temp.endPrice = $(obj).val();

            if(!Temp.endPrice||parseInt(Temp.endPrice)==0){ alert( Temp.futureDate+"收盘价数据为空，请提交数据"); return false; }

            endPriceArr.push(Temp);
        })
        if(!endPriceArr.length){ alert("收盘价数据为空，请先编辑数据"); return false; }

        $.post('http://localhost:8080/school2/jiesebang/collectPrice.php',{
              //cifcoName:$('#tabBody').attr('cifcoName'), //期货公司名称
              futureName:$('#futures_contract').val(), //rb1905
              datas:endPriceArr
        },function(){
        });
    });

    $("#cals").click(function(){
         console.log("??");
        $(".send").each(function(index,obj){

           var endPrice = parseInt($(obj).val());
           var parentElem = $(obj).parent().parent();
           var longOld = parentElem.find('.longprice');
           var shortOld = parentElem.find('.shortprice');

           console.log(longOld,shortOld);

           var longOldPrice = parseInt(longOld.html());
           var shortOldPrice = parseInt(shortOld.html());



           longOld.find('.tmp').html('');
           shortOld.find('.tmp').html('');

               //console.log(longOldPrice,shortOldPrice);
               if(longOldPrice!=0){
                   if(endPrice>longOldPrice){
                       longOld.append("<span class='tmp' style='color:red'>盈 "+String(endPrice-longOldPrice)+"</span>");
                   }else{
                       longOld.append("<span class='tmp' style='color:green'>亏 "+String(endPrice-longOldPrice)+"</span>");
                   }
               }
               if(shortOldPrice!=0){
                   if(endPrice>shortOldPrice){ //3400  空3452
                       shortOld.append("<span class='tmp' style='color:green'>亏 "+String(shortOldPrice-endPrice)+"</span>")
                   }else{
                       shortOld.append("<span class='tmp' style='color:red'>盈 "+String(shortOldPrice-endPrice)+"</span>")
                   }
               }


        })


    })

    function searchData() {

        }



  GM_addStyle("\
  .bt {\
    position:absolute;\
    top:38px;\
    left:46px;\
  }\
  ");
  GM_addStyle("\
  .bt2 {\
    position:absolute;\
    top:38px;\
    left:209px;\
  }\
  ");
  GM_addStyle("\
  .bt3 {\
    position:absolute;\
    top:65px;\
    left:309px;\
  }\
  ");
  GM_addStyle("\
  .bt4 {\
    position:absolute;\
    top:65px;\
    left:425px;\
  }\
  ");
  GM_addStyle("\
  .bt5 {\
    position:absolute;\
    top:65px;\
    left:535px;\
  }\
  ");

  GM_addStyle("\
  .bt6 {\
    position:absolute;\
    top:8px;\
    left:400px;\
  }\
  ");

  GM_addStyle("\
  .content {\
    position:relative;\
    z-index:1;\
  }\
  ");

  GM_addStyle("\
  .red {\
    color:red;\
    font-weight:bolder;\
  }\
  ");

  GM_addStyle("\
  .green {\
    color:#07b70c;\
    font-weight:bolder;\
  }\
  ");

  GM_addStyle("\
  .nocolor {\
    color:#000;\
    font-weight:normal;\
  }\
  ");

  GM_addStyle("\
  .red {\
    height:270px;\
    overflow:hidden;\
  }\
  ");

  GM_addStyle("\
   .s7 div{\
    float:left;\
    width:80px;\
    cursor:pointer;\
    height:70px;\
    line-height:18px;\
  }\
  ");
  GM_addStyle("\
   span.o1,span.o2{\
    display:block;\
  }\
  ");

})();