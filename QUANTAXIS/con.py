import pymysql

def connDBremote():
   db = pymysql.connect(
       host='jiese3601.da01.861dns.com',
       port=3306,
       user='jiese3601_1',
       passwd='aaa121914',
       db='jiese3601_1',
       charset='utf8'
   )
   return db