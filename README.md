# QUANTAXIS tushare for quant


## QUANTAXIS
### 2019-04-10 
* single.py 命令行获取单个品种过去120天的收盘价，空头多头主力信息，以便决策
``` python
python3 single.py code|[time]
eg: single.py FU1909 2019-04-09
```

## 2019-01-10
* ceshi.py 获取大商所，郑商所，上交所，股指期货所有合约收盘价信息，
``` python
python3 single.py |[time]
eg: ceshi.py 2019-04-09
``` 
<img src="https://github.com/tedQB/easymoney/blob/master/img/Snip20190410_12.png" width=300>


## tampermonkey
技术栈
* 使用chrome插件+tampermonkey
* 数据用的东财数据
* 数据量太大，不便每日按时存数据库，直接就解析线上的json接口。
  
1. 自制门户，方便看财经新闻，搜索，提升获取信息效率。
<img src="https://github.com/tedQB/easymoney/blob/master/img/Snip20190410_15.png" width=800>
<img src="https://github.com/tedQB/easymoney/blob/master/img/Snip20190410_17.png" width=800>
