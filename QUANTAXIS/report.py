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
    print(jingduoData[0][0],jingduoData[0][1],jingduoData[0][2],jingduoData[0][3])
    print(jingduoData[1][0],jingduoData[1][1],jingduoData[1][2],jingduoData[1][3])
    print('净空单')
    print(jingkongData[0][0],jingkongData[0][1],jingkongData[0][2],jingkongData[0][3])
    print(jingkongData[1][0],jingkongData[1][1],jingkongData[1][2],jingkongData[1][3])
    print('=========')
    # if format(float(jingduoData[0][3])/float(jingkongData[0][3]),'.3f')>1.764: 
    #   tempArr.append('多头信号')
    #   tempArr.append(jingduoData)
    #   tempArr.append(jingkongData)
      
    # elif format(float(jingkongData[0][3])/float(jingduoData[0][3]),'.3f')>1.764:
    #   tempArr.append('空头信号')
    #   tempArr.append(jingduoData)
    #   tempArr.append(jingkongData)



    #print(type(member))
    #print(jingduoData['0']['cifcoName'],jingduoData['0']['jingduoNum'])
    #print(jingduoData['1']['cifcoName'],jingduoData['1']['jingduoNum'])
    # 测试语句
    # for row in jingduoData: 
    #     futureName = row[0]
    #     cifcoName = row[1]
    #     jingduoNum = row[4]
        
    #     print("futureName",futureName,"cifcoName",cifcoName,"jingduoNum",jingduoNum)



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
            #print("futureName",futureName)

        conn.commit()

    except Exception as e:
        print("通过主键读取一条记录:" + str(e))
        conn.rollback()
    finally:
        conn.close()

if __name__ == '__main__':
    main('2019-07-19')


