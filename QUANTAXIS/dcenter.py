import urllib.request
import urllib.parse
import json
import re
import time
import datetime
import pymysql
import sys

from item import get_newContractList, get_market_own
from datetime import timedelta
from endPrice import end_price_get
from single import taskSingle
import akshare as ak


def connDB():
   db = pymysql.connect(
       host='localhost',
       port=8889,
       user='root',
       passwd='123',
       db='jiese360',
       charset='utf8'
   )
   return db


def insertData(futureName, cifcoName, riqi, jiesuan, chengjiaoNum, duodanNum, kongdanNum, jingduoNum, jingkongNum, longEvePrice, shortEvePrice):
    insertSql = "replace INTO futures (futureName,cifcoName,riqi,jiesuan,chengjiaoNum,duodanNum,kongdanNum,jingduoNum,jingkongNum,longEvePrice,shortEvePrice) VALUES('%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s')" % (
                futureName, cifcoName, riqi, jiesuan, chengjiaoNum, duodanNum, kongdanNum, jingduoNum, jingkongNum, longEvePrice, shortEvePrice)
    try:
        conn = connDB()
        cur = conn.cursor()
        cur.execute(insertSql)
        conn.commit()
    except Exception as e:
        conn.rollback()
    finally:
        conn.close()


def get_winners_list_data(code, sc, mkt, nowTime):
    url = 'http://datainterface.eastmoney.com/EM_DataCenter/JS.aspx?type=QHCC&sty=QHSYCC&stat=3&fd='+nowTime+'&mkt='+mkt+'&code='+code+'&sc='+sc+'&cb=callback&callback=callback&_=1551263991687'
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36'
    }
    request = urllib.request.Request(url=url, headers=headers)
    response = urllib.request.urlopen(request)
    try:
        j = json.loads(re.findall(r'^\w+\((.*)\)$',
                                   response.read().decode('utf-8'))[0])
        for i in range(len(j[0]['净多头龙虎榜'])):
            x1 = j[0]['净多头龙虎榜'][i].split(",")
            cmd1 = x1[0]
            cifcoName1 = x1[1]
            get_position_buildin_mobile(
                mkt, sc, cmd1, code, cifcoName1, nowTime, "净多头")

        for m in range(len(j[0]['净空头龙虎榜'])):
            x2 = j[0]['净空头龙虎榜'][m].split(",")
            cmd2 = x2[0]
            cifcoName2 = x2[1]
            get_position_buildin_mobile(
                mkt, sc, cmd2, code, cifcoName2, nowTime, "净空头")


    except json.decoder.JSONDecodeError:
        print ("catch error")

    #mkt=069001007 大连商品期货交易所 sc=名称缩写M(豆粕) cmd=80098329（期货公司代码）code=m1905(合约代码小写)


def get_position_buildin_mobile(mkt, sc, cmd, code, cifcoName, nowTime, tit):

    url2 = "http://m.data.eastmoney.com/api/Futures/TppGetTimelien?mtk="+mkt+"&code="+code+"&sc%5B%5D="+sc+"&cmd="+cmd+"&pageNum=1&pageSize=20"

    print(url2+tit)
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Safari/537.36'
    }
    request = urllib.request.Request(url=url2, headers=headers)
    response = urllib.request.urlopen(request)
    try:
        j = json.loads(re.findall(r'^(.*)$',
                              response.read().decode('utf-8'))[0])
        i = 20
        for row in j['result']:
            if i>0:
                riqi = row['日期']
                jiesuan = row['结算价']
                chengjiaoNum = row['成交量']
                duodanNum = row['多单量']
                kongdanNum = row['空头持仓']
                jingduoNum = row['净多单']
                jingkongNum = row['净空单']
                longEvePrice = row['多头持仓均价']
                shortEvePrice = row['空头持仓均价']
                futureName = code.lower()
                insertData(futureName, cifcoName, riqi, jiesuan, chengjiaoNum, duodanNum,
                        kongdanNum, jingduoNum, jingkongNum, longEvePrice, shortEvePrice)
                i=i-1

    except json.decoder.JSONDecodeError:
        print("catch error", code)

        #print(nowTime+" "+code+"合约采集结束")


def insertDailyKLine(code, date, opens, highs, lows, close, vols):
    insertSql = "replace INTO dayLine (code, date, opens, highs, lows, close, vols) VALUES('%s','%s','%s','%s','%s','%s','%s')" % (
                code, date, opens, highs, lows, close, vols)
    try:
        conn = connDB()
        cur = conn.cursor()
        cur.execute(insertSql)
        conn.commit()
    except Exception as e:
        conn.rollback()
    finally:
        conn.close()


def get_data_buildin_akshare(code, nowTime):
    try:
        futures_zh_daily_sina_df = ak.futures_zh_daily_sina(symbol=code)
        date = futures_zh_daily_sina_df['date']
        opens = futures_zh_daily_sina_df['open']
        highs = futures_zh_daily_sina_df['high']
        lows = futures_zh_daily_sina_df['low']
        closes = futures_zh_daily_sina_df['close']
        vols = futures_zh_daily_sina_df['volume']

        idx = len(date)
        while idx > 0:
            idx -= 1
            date_val = date[idx]
            open_val = opens[idx]
            high_val = highs[idx]
            low_val = lows[idx]
            close_val = closes[idx]
            vol_val = vols[idx]
            try:
                insertDailyKLine(code, date_val, open_val, high_val, low_val, close_val, vol_val)
            except KeyError:
                print(code+"插入数据错误")
                continue;

    except Exception as e:
        print(code+"数据不存在")
    


def get_data_buildin(code, nowTime):
    url = "http://stock2.finance.sina.com.cn/futures/api/json.php/IndexService.getInnerFuturesDailyKLine?symbol=" +  code
    #url = "https://stock2.finance.sina.com.cn/futures/api/jsonp.php/var=/InnerFuturesNewService.getDailyKLine?symbol=" + code
    #新浪https接口有防爬机制

    print(url)
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36'
    }
    request = urllib.request.Request(url=url, headers=headers)
    response = urllib.request.urlopen(request)
    #print('response',response.read().decode('utf-8'))


    j = json.loads(response.read().decode('utf-8'))
    #print('j',len(j))
    if j:
        for i in range(len(j)):
            try:
                row = j[i]
                date = row[0]       
                opens = row[1]      #开盘价     open
                highs = row[2]      #最高价   high  
                lows = row[3]       #最低价    low
                close = row[4]     #收盘价    close
                vols = row[5]       #成交量    vol
                insertDailyKLine(code, date, opens, highs, lows, close, vols)

            except KeyError:
                print(code+"数据不存在")
                continue;
    else:
        print(code+"数据不存在")

    print(nowTime+" "+code+"合约采集结束")


if __name__ == '__main__':
    if len(sys.argv)==1:
        nowTime = datetime.datetime.now().strftime('%Y-%m-%d')
    else:
        nowTime = sys.argv[1]

    print('nowTime',nowTime)
    #end_price_get(nowTime)

    newContract = get_newContractList(nowTime)
    if newContract!=None:
        lens = len(newContract)
        for x in newContract:
            try:
                code = x['newContract']  # 最新合约
                sc = x['value'] #名称缩写大写
                mkts = get_market_own(sc) #归属市场
                mkt = mkts["Market"]
                lens=lens-1
                print(code+"数据中心采集开始,还剩"+str(lens)+"条")
                #get_winners_list_data(code, sc, mkt, nowTime)
                get_data_buildin_akshare(code,nowTime)
                time.sleep(1)
                #get_data_buildin(code,nowTime) # 默认采集7天
                #print(nowTime+" "+code+"合约采集结束")

            except KeyError:
                print(sc+"不存在")
                continue;



#aw_data = json.loads(response.read().decode("utf8"))

#print(aw_data)
