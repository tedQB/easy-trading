import urllib.request
import urllib.parse
import json
import re
import time
import datetime
import pymysql
import sys


from string import digits
from item import get_newContractList, get_market_own
from datetime import timedelta
from endPrice import end_price_get,task,date_add,fetchData

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

def insertInfos(futureName, riqi, codeLong, smallLong, codeShort, smallShort):
    print(futureName, riqi, codeLong, smallLong, codeShort, smallShort)
    insertSql = "replace INTO infos (futureName, riqi, codeLong, smallLong, codeShort, smallShort) VALUES('%s','%s','%s','%s','%s','%s')" % (
               futureName, riqi, codeLong, smallLong, codeShort, smallShort)
    try:
        conn = connDB()
        cur = conn.cursor()
        cur.execute(insertSql)
        conn.commit()
    except Exception as e:
        conn.rollback()
    finally:
        conn.close()

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


#获取具体时间具体品种龙虎榜数据全貌
def listTask(code, sc, mkt, starttime, today):

    print('执行期货龙虎榜数据收集')
    if today :
        nowTime = today
    else :
        nowTime = datetime.datetime.now().strftime('%Y-%m-%d')
    
    print('startTime',starttime, nowTime)
    try:
        df1 = fetchData(code, starttime, nowTime)
        date = df1[u'date']
        idx = len(date)
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36'
        }        
        while idx > 0:
            idx -= 1
            date_val = date[idx]
            url = 'http://datainterface.eastmoney.com/EM_DataCenter/JS.aspx?type=QHCC&sty=QHSYCC&stat=3&fd='+date_val+'&mkt='+mkt+'&code='+code+'&sc='+sc+'&cb=callback&callback=callback&_=1551263991687'
            request = urllib.request.Request(url=url, headers=headers)
            response = urllib.request.urlopen(request)
            print('url',url)
            j = json.loads(re.findall(r'^\w+\((.*)\)$',
                                       response.read().decode('utf-8'))[0])
            # 2021-02-28 加入每日小户持仓量，程序化多空头持仓量数据计算爬取
            lix = []
            for i in range(len(j[0]['成交量龙虎榜'])): #找到程序化席位
                x1 = j[0]['成交量龙虎榜'][i].split(",")
                lix.append(x1[1])

            dlix = {}
            slix = {}
            for i in range(len(j[0]['多头持仓龙虎榜'])):
                x1 = j[0]['多头持仓龙虎榜'][i].split(",")
                dlix[x1[1]] = int(x1[2])

            for i in range(len(j[0]['空头持仓龙虎榜'])):
                x1 = j[0]['空头持仓龙虎榜'][i].split(",")
                slix[x1[1]] = int(x1[2])

            codeLong = []
            codeShort = []

            for x in lix :
                if x in dlix :
                    codeLong.append(dlix[x])
                    dlix.pop(x)

            for x in lix :
                if x in slix :
                    codeShort.append(slix[x])
                    slix.pop(x)

            insertInfos(code, date_val, sum(codeLong), sum(dlix.values()), sum(codeShort), sum(slix.values()))

            print(sum(codeLong)) 
            print(sum(dlix.values()))

            print(sum(codeShort))
            print(sum(slix.values()))

    except Exception as e:
      print("catch error"+code)
    

        # for i in range(len(j[0]['净多头龙虎榜'])):
        #     x1 = j[0]['净多头龙虎榜'][i].split(",")
        #     cmd1 = x1[0]
        #     cifcoName1 = x1[1]
        #     get_position_buildin_mobile(
        #         mkt, sc, cmd1, code, cifcoName1, nowTime, "净多头")

        # for m in range(len(j[0]['净空头龙虎榜'])):
        #     x2 = j[0]['净空头龙虎榜'][m].split(",")
        #     cmd2 = x2[0]
        #     cifcoName2 = x2[1]
        #     get_position_buildin_mobile(
        #         mkt, sc, cmd2, code, cifcoName2, nowTime, "净空头")


    except json.decoder.JSONDecodeError:
        print ("主力合约表catch error")

    #mkt=069001007 大连商品期货交易所 sc=名称缩写M(豆粕) cmd=80098329（期货公司代码）code=m1905(合约代码小写)

def get_winners_list_data(code, sc, mkt, nowTime):
    url = 'http://datainterface.eastmoney.com/EM_DataCenter/JS.aspx?type=QHCC&sty=QHSYCC&stat=3&fd='+nowTime+'&mkt='+mkt+'&code='+code+'&sc='+sc+'&cb=callback&callback=callback&_=1551263991687'
    print(url)
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
        print ("主力合约表catch error")

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
        i = 60
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
        print("龙虎榜catch error", code)

        #print(nowTime+" "+code+"合约采集结束")

def get_position_buildin(mkt, sc, cmd, code, cifcoName, nowTime):
    url = "http://datainterface.eastmoney.com/EM_DataCenter/JS.aspx?type=QHCC&sty=QHSYCC&stat=4" + "&mkt=" + mkt + "&sc=" + sc + "&cmd=" + cmd + "&code=" + code + "&name=2&cb=callback"
    print(url)
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36'
    }
    request = urllib.request.Request(url=url, headers=headers)
    response = urllib.request.urlopen(request)
    try:
        j = json.loads(re.findall(r'^\w+\((.*)\)$',
                                  response.read().decode('utf-8'))[0])
        i = 120
        for i in range(len(j)):
            if i > 0:
                row = j[i].split(",")
                riqi = row[0]
                jiesuan = row[1]
                chengjiaoNum =row[2]
                duodanNum = row[4]
                kongdanNum = row[7]
                jingduoNum = row[10]
                jingkongNum = row[11]
                longEvePrice = row[5]
                shortEvePrice = row[8]
                futureName = code.lower()
                insertData(futureName, cifcoName, riqi, jiesuan, chengjiaoNum, duodanNum,
                        kongdanNum, jingduoNum, jingkongNum, longEvePrice, shortEvePrice)
                i = i-1

    except json.decoder.JSONDecodeError:
        print("catch error", code)

        #print(nowTime+" "+code+"合约采集结束")


def infoSingle(code,nowTime,day):
    day = int(day)
    remove_digits = str.maketrans('', '', digits)
    sc = code.translate(remove_digits)
    mkts = get_market_own(sc) #归属市场
    mkt = mkts["Market"]

    if day >0:
        listTask(code, sc, mkt, date_add(nowTime,-day), nowTime)
    else:
        listTask(code, sc, mkt, date_add(nowTime,-7))   #焦炭

    #print(code+"合约采集开始"+sc+mkt)
    #get_winners_list_data(code, sc, mkt, nowTime)
    #print(nowTime+" "+code+"合约采集结束")

def taskSingleOld(code,nowTime,day):
    day = int(day)
    if day >0:
        task(code, date_add(nowTime,-day))
    else:
        task(code, date_add(nowTime,-7))   #焦炭
    remove_digits = str.maketrans('', '', digits)
    sc = code.translate(remove_digits)
    mkts = get_market_own(sc) #归属市场
    mkt = mkts["Market"]

    print(code+"合约采集开始"+sc+mkt)
    #infoSingle(code,nowTime,day)
    get_winners_list_data(code, sc, mkt, nowTime)
    print(nowTime+" "+code+"合约采集结束")

#-120 采集历史数据天数，今天开始向后倒120天
def taskSingle(code,nowTime,day):
    day = int(day)
    if day >0:
        task(code, date_add(nowTime,-day))
    else:
        task(code, date_add(nowTime,-7))   #焦炭
    remove_digits = str.maketrans('', '', digits)
    sc = code.translate(remove_digits)
    mkts = get_market_own(sc) #归属市场
    mkt = mkts["Market"]

    print(code+"合约采集开始"+sc+mkt)
    infoSingle(code,nowTime,day)
    #get_winners_list_data(code, sc, mkt, nowTime)
    print(nowTime+" "+code+"合约采集结束")



if __name__ == '__main__':
    if len(sys.argv)==1:
        print('请输入合约代码？？')
    elif len(sys.argv)==2:
        code = sys.argv[1]
        nowTime = datetime.datetime.now().strftime('%Y-%m-%d')
    elif len(sys.argv)==3:
        code = sys.argv[1]
        nowTime = sys.argv[2]
    elif len(sys.argv)==4:
        code = sys.argv[1]
        nowTime = sys.argv[2]
        day = sys.argv[3]
    #infoSingle(code,nowTime,day)
    taskSingleOld(code,nowTime,day)

#single.py FU1909 2019-04-09(今天日期)






#aw_data = json.loads(response.read().decode("utf8"))

#print(aw_data)
