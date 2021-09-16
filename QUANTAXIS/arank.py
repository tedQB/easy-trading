
import urllib.request
import urllib.parse
import json
import re
import time
import datetime
import pymysql
import sys
from datetime import timedelta
import pandas as pd

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


def insertDailyKLineSec(code, name, heat, rank, rankj, date):
    insertSql = "replace INTO dayRankSec (code, name, heat, rank, rankj, date) VALUES('%s','%s','%s','%s','%s','%s')" % (
                code, name, heat, rank, rankj, date)
    try:
        conn = connDB()
        cur = conn.cursor()
        cur.execute(insertSql)
        conn.commit()
    except Exception as e:
        conn.rollback()
    finally:
        conn.close()


def insertDailyKLine(code, name, heat, rank, rankj, date):
    insertSql = "replace INTO dayRank (code, name, heat, rank, rankj, date) VALUES('%s','%s','%s','%s','%s','%s')" % (
                code, name, heat, rank, rankj, date)
    try:
        conn = connDB()
        cur = conn.cursor()
        cur.execute(insertSql)
        conn.commit()
    except Exception as e:
        conn.rollback()
    finally:
        conn.close()


def timeAD(timeStr):
    array = time.strptime(timeStr, u"%Y-%m-%d")
    publishTime = time.strftime("%Y%m%d", array)
    #print(publishTime)
    return publishTime

def date_add(date_str, days_count=1):
    date_list = time.strptime(date_str, "%Y-%m-%d")
    y, m, d = date_list[:3]
    delta = timedelta(days=days_count)
    date_result = datetime.datetime(y, m, d) + delta
    date_result = date_result.strftime("%Y-%m-%d")
    return date_result


def get_bank_date(nowTime):

    futures_zh_daily_sina_df = ak.gainian_rank(date=timeAD(nowTime))
    print('futures_zh_daily_sina_df', futures_zh_daily_sina_df)

def get_data_buildin_akshare(nowTime):
    try:
        futures_zh_daily_sina_df = ak.stock_wc_hot_rank(date=timeAD(nowTime))

        code = futures_zh_daily_sina_df['股票代码']
        name = futures_zh_daily_sina_df['股票简称']
        heat = futures_zh_daily_sina_df['个股热度']
        rank = futures_zh_daily_sina_df['个股热度排名名次']
        rankj = futures_zh_daily_sina_df['个股热度排名']
        date = futures_zh_daily_sina_df['排名日期']
        #print(code,name, heat,rank,rankj)
        dateSec = datetime.datetime.now().strftime('%Y-%m-%d %H:%M') #保存分钟秒级数据

        idx = len(date)
        while idx > 0:
            idx -= 1
            code_val = code[idx]
            name_val = name[idx]
            heat_val = heat[idx]
            rank_val = rank[idx]
            rankj_val = rankj[idx]
            date_val = date[idx]
            try:
                insertDailyKLine(code_val, name_val, heat_val, rank_val, rankj_val, date_val)
                insertDailyKLineSec(code_val, name_val, heat_val, rank_val, rankj_val, dateSec)
            except KeyError:
                print(code+"插入数据错误")
                continue;

    except Exception as e:
        print(code+"数据不存在")
    


if __name__ == '__main__':

    if len(sys.argv)==3:
        startTime = sys.argv[1]
        endTime =  sys.argv[2]
        tt = pd.date_range(pd.to_datetime(startTime),
                           pd.to_datetime(endTime), freq='D')

    elif len(sys.argv)==2:
        startTime = sys.argv[1]
        endTime = datetime.datetime.now().strftime('%Y-%m-%d')
        tt = pd.date_range(pd.to_datetime(startTime),
                           pd.to_datetime(endTime), freq='D')
    else:
        endTime = datetime.datetime.now().strftime('%Y-%m-%d')
        tt = pd.date_range(pd.to_datetime(endTime),
                           pd.to_datetime(endTime), freq='D')

    #tt = pd.date_range(start=date_add(nowTime,-60), end=nowTime, freq='D')

    for x in tt:
        print(x.strftime('%Y-%m-%d'),'开始')
        get_data_buildin_akshare(x.strftime('%Y-%m-%d'))
        #get_bank_date(x.strftime('%Y-%m-%d'))
        print(x.strftime('%Y-%m-%d'),'结束')

