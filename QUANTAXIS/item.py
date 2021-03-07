import urllib.request
import urllib.parse
import json
import re


def get_market_own(key):
    market = {
            "AG":{ #沪银
                'Market': "069001005",
                'code':'ag',
                'i18n':'沪银'
            },
            "AL": {#沪铝
                'Market': "069001005",
                'code': 'al',
                'i18n':'沪铝'
            },
            "SS": {#不锈钢
                'Market': "069001005",
                'code': 'ss',
                'i18n':'不锈钢'
            },
            "AU": {#沪金
                'Market': "069001005",
                'code': 'au',
                'i18n':'沪金'
            },
            "BU": {#沥青
                'Market': "069001005",
                'code': 'bu',
                'i18n':'沥青'
            },
            "CU": {#沪铜
                'Market': "069001005",
                'code': 'cu',
                'i18n':'沪铜'
            },
            "FU": {#燃油
                'Market': "069001005",
                'code': 'fu',
                'i18n':'燃油'
            },
            "HC": {#热卷
                'Market': "069001005",
                'code': 'hc',
                'i18n':'热卷'
            },
            "NI": {#沪镍
                'Market': "069001005",
                'code': 'ni',
                'i18n':'沪镍'
            },
            "PB": {#沪铅
                'Market': "069001005",
                'code': 'pb',
                'i18n':'沪铅'
            },
            "RB": {#螺纹钢
                'Market': "069001005",
                'code': 'rb',
                'i18n':'螺纹钢'
            },
            "RU": {#橡胶
                'Market': "069001005",
                'code': 'ru',
                'i18n':'橡胶'
            },
            "SN": {#沪锡
                'Market': "069001005",
                'code': 'sn',
                'i18n':'沪锡'
            },
            "SP": {#纸浆
                'Market': "069001005",
                'code': 'ap',
                'i18n':'纸浆'
            },
            "ZN": { #沪锌
                'Market': "069001005",
                'code': 'zn',
                'i18n':'沪锌'
            },
            "I": { #铁矿石
                'Market': "069001007",
                'code': 'ag',
                'i18n':'铁矿石'
            },
            "LH": { 
                'Market': "069001007",
                'code': 'lh',
                'i18n':'生猪'

            },
                    "J": { #焦炭
                'Market': "069001007",
                'code': 'j',
                'i18n':'焦炭'
            },
                    "JD": { #鸡蛋
                'Market': "069001007",
                'code': 'jd',
                'i18n':'鸡蛋'
            },
                    "JM": { #焦煤
                'Market': "069001007",
                'code': 'jm',
                'i18n':'焦煤'
            },
                    "L": { #塑料
                'Market': "069001007",
                'code': 'l',
                'i18n':'塑料'
            },
                    "M": {#豆粕
                'Market': "069001007",
                'code': 'm',
                'i18n':'豆粕'
            },
                    "P": { #棕榈
                'Market': "069001007",
                'code': 'p',
                'i18n':'棕榈'
            },
            "Y": { #豆油
                'Market': "069001007",
                'code': 'y',
                'i18n':'豆油'
            },
            "EG": {#乙二醇
                'Market': "069001007",
                'code': 'eg',
                'i18n':'乙二醇'
            },
            "EB": {#苯乙烯
                'Market': "069001007",
                'code': 'eb',
                'i18n':'苯乙烯'
            },
            "PP": { #PP
                'Market': "069001007",
                'code': 'pp',
                'i18n':'聚丙烯'
            },
            "PG": {#液化石油气
                'Market': "069001007",
                'code': 'pg',
                'i18n':'液化石油气'
            },
             "A": { #豆一
                  'Market': "069001007",
                  'code': 'a',
                  'i18n':'豆一'
             },
            "ZC": {#郑煤
                'Market': "069001008",
                'code': 'zc',
                'i18n':'郑煤'
            },
            "TA": { #PTA
                'Market': "069001008",
                'code': 'ta',
                'i18n':'PTA'
            },
            "SA": { 
                'Market': "069001008",
                'code': 'sa',
                'i18n':'纯碱'
            },
            "PK": { 
                'Market': "069001008",
                'code': 'pk',
                'i18n':'花生'
            },                      
            "SR": { #白糖
                'Market': "069001008",
                'code': 'sr',
                'i18n':'白糖'
            },
            "SM": { #硅锰
                'Market': "069001008",
                'code': 'SM',
                'i18n':'硅锰'
            },
            "SF": { #硅铁
                'Market': "069001008",
                'code': 'sf',
                'i18n':'硅铁'
            },
            "RM": { #菜粕
                'Market': "069001008",
                'code': 'rm',
                'i18n':'菜粕'
            },
            "OI": { #郑油
                'Market': "069001008",
                'code': 'oi',
                'i18n':'郑油'
            },
            "MA": { #郑醇
                'Market': "069001008",
                'code': 'ma',
                'i18n':'郑醇'
            },
            "FG": {#玻璃
                'Market': "069001008",
                'code': 'fg',
                'i18n':'玻璃'
            },
            "AP": { #苹果
                'Market': "069001008",
                'code': 'ap',
                'i18n':'苹果'
            },
            "CJ":{ #红枣
                'Market':"069001008",
                'code':'cj',
                'i18n':'红枣'
            },
            "CF":{ #郑棉
                'Market':"069001008",
                'code':'cf',
                'i18n':'郑棉'
            },
            "IF":{ #沪深300股指
                "Market": "069001009",
                'code':'if',
                'i18n':'沪深300股指'
            },
            "IC": { #中证500期货
                "Market": "069001009",
                'code':'ic',
                'i18n':'中证500期货'
            },
            "IH": { #上证50期货
                "Market": "069001009",
                'code':'ih',
                'i18n':'上证50期货'
            },
            "T": {
                "Market": "069001009",
                'code':'T',
                'i18n':'10年债'
            },
            "TF": {
                "Market": "069001009",
                'code':'TF',
                'i18n':'5年债'
            },
            "TS": {
                "Market": "069001009",
                'code':'TS',
                'i18n':'2年债'
            },            
            "B": { #豆二
                 'Market': "069001007",
                 'code': 'b',
                 'i18n':'豆二'
            },
            "C": {#玉米
                 'Market': "069001007",
                 'code': 'c',
                 'i18n':'玉米'
            },
            "CS": { #淀粉
                 'Market': "069001007",
                 'code': 'cs',
                 'i18n':'淀粉'
            },
            "PP": { #PP
                 'Market': "069001007",
                 'code': 'pp',
                 'i18n':'PP'
            }
            #         "V": {
            #     'Market': "069001007",
            #     'code': 'ag'
            # },
            # "WH": { #郑麦
            #     'Market': "069001008",
            #     'code': 'ag'
            # },
            # "PM": { #普麦
            #     'Market': "069001008",
            #     'code': 'ag'
            # },
            # "JR": { 粳稻
            #     'Market': "069001008",
            #     'code': 'ag'
            # },
            #"LR":{  #晚稻
             #   "Market":"****"
            #},
            #"RS": { #菜籽
            #    'Market': "069001005",
            #},
        }
    return market[key]


def quote_keys_for_json(json_str):
    """给键值不带双引号的json字符串的所有键值加上双引号。
    注：解析一般的不严格的json串，可以checkout https://github.com/dmeranda/demjson, 速度比标准库要慢。"""
    quote_pat = re.compile(r'".*?"')
    a = quote_pat.findall(json_str)
    json_str = quote_pat.sub('@', json_str)
    key_pat = re.compile(r'(\w+):')
    json_str = key_pat.sub(r'"\1":', json_str)
    assert json_str.count('@') == len(a)
    count = -1

    def put_back_values(match):
        nonlocal count
        count += 1
        return a[count]
    json_str = re.sub('@', put_back_values, json_str)
    return json_str


def get_from_url(api, nowTime):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36'
    }
    request = urllib.request.Request(url=api, headers=headers)
    response = urllib.request.urlopen(request)
    try:
        j = json.loads(re.findall(r'^(.*)$',
                                      response.read().decode('utf-8'))[0])
        array = eval(quote_keys_for_json(j))
        return array
    except Exception as e:
        print(nowTime+"数据尚未就绪")


def get_newContractList(nowTime):
    """
        获取主力合约列表
        nowTime 日期 **-**-**
    """
    api = 'http://m.data.eastmoney.com/api/futures/GetContract?market=069001005&date='+nowTime
    return get_from_url(api, nowTime)












