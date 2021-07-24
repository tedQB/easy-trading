# About

股票，期货量化数据采集工具，可方便采集股指期货，期货多空数据，可视化分析

# 说明

>  如果对您对此项目有兴趣，可以点 "Star" 支持一下 谢谢！

>  开发环境 : macOS 10.13.6  python3  mysql 5.1.73 

>  如有问题请直接在 Issues 中提，或者您发现问题并有非常好的解决方案，欢迎 PR 👍



## 技术栈

python3 + mysql + QUANTAXIS + mongodb

## 项目运行


```
pip install QUANTAXIS (需要安装mongodb)

git clone git@github.com:tedQB/user-space.git

```

``` python
python3 single.py code|[time]
eg: single.py FU1909 2019-04-09
```

``` python
python3 ceshi.py |[time]
eg: ceshi.py 2019-04-09
``` 


## 目标功能

- [x] 获取大商所，郑商所，上交所，股指期货所有合约收盘价信息 -- 完成
- [x] 命令行获取单个品种过去120天的收盘价，空头多头主力信息，以便决策 --完成
- [x] 数据提交到本地mysql数据库 -- 完成
- [x] 采集后数据前端渲染 -- 完成



## 系统截图
<img src="https://github.com/tedQB/easy-trading/blob/master/img/409.png?raw=true" width=400>

<img src="https://github.com/tedQB/easy-trading/blob/master/img/410.png?raw=true" width=400>

## 量化图形

<img src="https://github.com/tedQB/easy-trading/blob/master/img/411.jpg?raw=true" width=600>
<img src="https://github.com/tedQB/easy-trading/blob/master/img/412.jpg?raw=true" width=600>
<img src="https://github.com/tedQB/easy-trading/blob/master/img/413.jpg?raw=true" width=600>

## License

[GPL](https://raw.githubusercontent.com/tedQB/user-manage/master/COPYING)
