import urllib.request
import urllib.parse
import json
import re
import time
import datetime
import pymysql
import sys
import string

from item import get_newContractList, get_market_own
from datetime import timedelta
from endPrice import end_price_get

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

def getData(sql):
  try:
    conn = connDB()
    cur = conn.cursor()
    count = cur.execute(sql)
    result = cur.fetchall()

    return result

    # #遍历一条数据方式1
    # for row in result:
    #     futureName = row[0]
    #     cifcoName = row[1]
    #     jingduoNum = row[4]
    #     print("futureName",futureName,"cifcoName",cifcoName,"jingduoNum",jingduoNum)
    #     # print("cifcoName",cifcoName)
    #     # print("jingduoNum",jingduoNum)

    conn.commit()

  except Exception as e:
      print("通过主键读取一条记录:" + str(e))
      conn.rollback()
  finally:
      conn.close()    

def insertSignal(sql):
   try:
      conn = connDB()
      cur = conn.cursor()
      cur.execute(sql)
      conn.commit()

   except Exception as e:
      conn.rollback()
   finally:
      conn.close()

 

mailArr = []

def generateMail(riqi,futureName):
  tempArr = []
  jingkong = "select futureName, cifcoName, riqi, jingkongNum from futures WHERE riqi='"+riqi+"' and futureName='"+futureName+"' GROUP BY jingkongNum order by jingkongNum desc limit 2"
  jingduo = "select futureName, cifcoName, riqi, jingduoNum from futures WHERE riqi='"+riqi+"' and futureName='"+futureName+"' GROUP BY jingduoNum order by jingduoNum desc limit 2"

  jingduoData = getData(jingduo)
  jingkongData = getData(jingkong)

  if(len(jingduoData)>=2):
    print('=========')
    print('净多单')
    print(i18n(jingduoData[0][0]),jingduoData[0][0],jingduoData[0][1],jingduoData[0][2],jingduoData[0][3])
    print(i18n(jingduoData[1][0]),jingduoData[1][1],jingduoData[1][2],jingduoData[1][3])
    print('净空单')
    print(i18n(jingkongData[0][0]),jingkongData[0][1],jingkongData[0][2],jingkongData[0][3])
    print(i18n(jingkongData[1][0]),jingkongData[1][1],jingkongData[1][2],jingkongData[1][3])
    print('=========')

    if(float(format(float(jingduoData[0][3])/float(jingkongData[0][3]),'.3f'))>1.764): 
      tempArr.append(jingduoData)
      tempArr.append(jingkongData)
      tempArr.append(1)


      insertSignal("UPDATE Price SET signal1 = '%d' where futureName = '%s' and riqi = '%s'" % (
        1,jingduoData[0][0].upper(), riqi))
      
      if(float(format(float(jingduoData[0][3])/float(jingduoData[1][3]),'.3f'))>1.964):
        tempArr.append(11)
        insertSignal("UPDATE Price SET signal2 = '%d' where futureName = '%s' and riqi = '%s'" % (
        11,jingduoData[0][0].upper(), riqi))


    if(float(format(float(jingkongData[0][3])/float(jingduoData[0][3]),'.3f'))>1.764): 
      tempArr.append(jingduoData)
      tempArr.append(jingkongData)
      tempArr.append(-1)
      insertSignal("UPDATE Price SET signal1 = '%d' where futureName = '%s' and riqi = '%s'" % (
        -1,jingduoData[0][0].upper(), riqi))
      
      if(float(format(float(jingkongData[0][3])/float(jingkongData[1][3]),'.3f'))>1.964):
        tempArr.append(-11)
        insertSignal("UPDATE Price SET signal2 = '%d' where futureName = '%s' and riqi = '%s'" % (
        -11,jingduoData[0][0].upper(), riqi))

    if len(tempArr):
      mailArr.append(tempArr)
    else:
      print(tempArr)

def i18n(s):
    result = ''.join(re.split(r'[^A-Za-z]', s)) #获取品种前缀
    mkts = get_market_own(result.upper())
    futureI18n = mkts['i18n']
    return futureI18n


def main(riqi):
   	#returnAllFutureName = "replace INTO futures (futureName,riqi) VALUES('%s','%s')" % (
                #futureName, riqi)
    print(riqi)
    selectFutureName = "SELECT distinct futureName from futures WHERE riqi = '"+riqi+"'"
    #returnAllFutureName = 'SELECT * from futures'
    try:
        conn = connDB()
        cur = conn.cursor()
        count = cur.execute(selectFutureName)
        result = cur.fetchall()

        #遍历一条数据方式1
        for row in result:
            futureName = row[0]
            generateMail(riqi, futureName) 

        conn.commit()

    except Exception as e:
        print("通过主键读取一条记录:" + str(e))
        conn.rollback()
    finally:
        conn.close()

    print("需要发的邮件",mailArr)


if __name__ == '__main__':
    main('2019-09-04')


