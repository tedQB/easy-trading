#!/usr/bin/python
# coding: UTF-8


#import MySQLdb
import tushare as ts
import datetime
import time
from datetime import timedelta


def date_add(date_str, days_count=1):
    date_list = time.strptime(date_str, "%Y%m%d")
    y, m, d = date_list[:3]
    delta = timedelta(days=days_count)
    date_result = datetime.datetime(y, m, d) + delta
    date_result = date_result.strftime("%Y%m%d")
    return date_result


if __name__ == '__main__':

   trade_date_arr = []
   pre_close_arr = []

   pro = ts.pro_api('15cbb84b1fdd9a026aee178b4a1aae1543aaef4b4a08866f4f0c27f1')

   df3 = pro.fut_daily(ts_code='M1905.DCE', start_date='20181201',
                     end_date=datetime.datetime.now().strftime('%Y%m%d'))
   trade_date = df3[u'trade_date']
   pre_close = df3[u'pre_close']
   idx=len(trade_date)


   while idx>0:
      idx -= 1
   
      trade_date_val = date_add(trade_date[idx],-1)
      pre_close_val = pre_close[idx]

      print trade_date_val, pre_close_val 




