#!/usr/bin/python
# coding: UTF-8


import QUANTAXIS as QA
import datetime
import pymysql
import time
from datetime import timedelta
from item import get_newContractList

def date_add(date_str, days_count=1):
    date_list = time.strptime(date_str, "%Y-%m-%d")
    y, m, d = date_list[:3]
    delta = timedelta(days=days_count)
    date_result = datetime.datetime(y, m, d) + delta
    date_result = date_result.strftime("%Y-%m-%d")
    return date_result


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


def fetchData(futureName, starttime, nowTime):
   return QA.QAFetch.QATdx.QA_fetch_get_future_day(
       futureName, starttime, nowTime)


def task(futureName, starttime):   
  #bug 输入历史数据，python3 ceshi.py 2019-07-19 拉到的数据是从2019-07-12到当天的数据
   QA.QA_util_log_info(futureName+'期货收盘价')
   nowTime = datetime.datetime.now().strftime('%Y-%m-%d')
   print('startTime',starttime)
   try:
      df1 = fetchData(futureName, starttime, nowTime)
      #print(df1)
      close = df1[u'close']
      date = df1[u'date']
      idx = len(date)
      while idx > 0:
         idx -= 1
         date_val = date[idx]
         close_val = close[idx]

         insertSql = "replace INTO Price (futureName, riqi, endPrice) VALUES('%s','%s',%d)" % (
            futureName, date_val, close_val)
         try:
            conn = connDB()
            cur = conn.cursor()
            cur.execute(insertSql)
            conn.commit()

         except Exception as e:
            conn.rollback()
         finally:
            print (date_val+" "+futureName+"合约收盘价采集结束")
            conn.close()

   except Exception as e:
      print("catch error"+futureName)


def end_price_get(today):
   print (today+"收盘价获取")
   newContract = get_newContractList(today)
   if newContract != None:
      for x in newContract:
         try:
               code = x['newContract']  # 最新合约
               task(code, date_add(today,-7))

         except KeyError:
               break

'''
   task('J1905', date_add(today,-7))   #焦炭
   task('RB1905', date_add(today,-7))  #螺纹钢
   task('HC1905', date_add(today,-7))  #热卷
   task('I1905', date_add(today,-7))   #铁矿石
   task('RU1905', date_add(today,-7))  #橡胶
   task('M1905', date_add(today,-7))   #豆粕
   task('AP1905', date_add(today,-7))  #苹果
   task('TA1905', date_add(today, -7)) #PTA
   task('FU1905', date_add(today,-7))  #燃油
   task('EG1906', date_add(today, -7)) #乙二醇
   task('BU1906', date_add(today, -7))  # 沥青
   task('FG1905', date_add(today, -7))  # 玻璃
   task('RM1905', date_add(today, -7))  # 菜粕
   task('ZC1905', date_add(today, -7))  # 郑煤
   task('P1905', date_add(today, -7))  # 棕榈
   task('SM1905', date_add(today, -7))  # 硅锰
   task('SF1905', date_add(today, -7))  # 硅铁
   task('MA1905', date_add(today, -7))  # 郑醇
   task('JM1905', date_add(today, -7))  # 焦煤
   task('SP1906', date_add(today, -7))  # 纸浆
   task('CF1905', date_add(today, -7))  # 郑棉
'''
