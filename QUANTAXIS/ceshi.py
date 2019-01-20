#!/usr/bin/python
# coding: UTF-8


import QUANTAXIS as QA
import datetime
import pymysql
import time
from datetime import timedelta

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


def fetchData(futureName,starttime):
   return QA.QAFetch.QATdx.QA_fetch_get_future_day(
       futureName,starttime, datetime.datetime.now().strftime('%Y-%m-%d'))


def task(futureName, starttime):
   QA.QA_util_log_info(futureName+'期货收盘价')
   df1 = fetchData(futureName, starttime)
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
         print (date_val+futureName+"合约采集结束")
         conn.close()

if __name__ == '__main__':
   today = datetime.datetime.now().strftime('%Y-%m-%d')
   task('J1905', date_add(today,-7))
   task('RB1905', date_add(today,-7))
   task('HC1905', date_add(today,-7))
   task('I1905', date_add(today,-7))
   task('RU1905', date_add(today,-7))
   task('M1905', date_add(today,-7))
   task('AP1905', date_add(today,-7))
   task('FU1905', date_add(today,-60))
