import urllib.request
import urllib.parse
import json
import re


def get_market_own(key):
    market = { 
            "AU":{
                'Market':"069001005",
            },
            "AG":{ #沪银
                'Market': "069001005",
                'code':'ag'
            },
            "AL": {#沪铝
                'Market': "069001005",
                'code': 'al'
            },
            "AU": {#沪金
                'Market': "069001005",
                'code': 'bu'
            },
            "BU": {#沥青
                'Market': "069001005",
                'code': 'bu'
            },
            "CU": {#沪铜
                'Market': "069001005",
                'code': 'cu'
            },
            "FU": {#燃油
                'Market': "069001005",
                'code': 'fu'
            },
            "HC": {#热卷
                'Market': "069001005",
                'code': 'fu'
            },
            "NI": {#沪镍
                'Market': "069001005",
                'code': 'ag'
            },
            "PB": {#沪铅
                'Market': "069001005",
                'code': 'ag'
            },
            "RB": {#螺纹钢
                'Market': "069001005",
                'code': 'ag'
            },
            "RU": {#橡胶
                'Market': "069001005",
                'code': 'ag'
            },
            "SN": {#沪xin
                'Market': "069001005",
                'code': 'ag'
            },
            "SP": {#纸浆
                'Market': "069001005",
                'code': 'ag'
            },
            "ZN": { #沪锌
                'Market': "069001005",
                'code': 'ag'
            },
            "I": { #铁矿石
                'Market': "069001007",
                'code': 'ag'
            },
                    "J": { #焦炭
                'Market': "069001007",
                'code': 'ag'
            },
                    "JD": { #鸡蛋
                'Market': "069001007",
                'code': 'ag'
            },
                    "JM": { #焦煤
                'Market': "069001007",
                'code': 'ag'
            },
                    "L": { #塑料
                'Market': "069001007",
                'code': 'ag'
            },
                    "M": {#豆粕
                'Market': "069001007",
                'code': 'ag'
            },
                    "P": { #棕榈
                'Market': "069001007",
                'code': 'ag'
            },
            "Y": { #豆油
                'Market': "069001007",
                'code': 'ag'
            },
            "EG": {#乙二醇
                'Market': "069001007",
                'code': 'ag'
            },
            "ZC": {#郑煤
                'Market': "069001008",
                'code': 'ag'
            },
            "TA": { #PTA
                'Market': "069001008",
                'code': 'ag'
            },
            "SR": { #白糖
                'Market': "069001008",
                'code': 'ag'
            },
            "SM": { #硅锰
                'Market': "069001008",
                'code': 'ag'
            },
            "SF": { #硅铁
                'Market': "069001008",
                'code': 'ag'
            },
            "RM": { #菜粕
                'Market': "069001008",
                'code': 'ag'
            },
            "OI": { #郑油
                'Market': "069001008",
                'code': 'ag'
            },
            "MA": { #郑醇
                'Market': "069001008",
                'code': 'ag'
            },
            "FG": {#玻璃
                'Market': "069001008",
                'code': 'ag'
            },
            "AP": { #苹果
                'Market': "069001008",
                'code': 'ag'
            },
            "CJ":{ #红枣
                'Market':"069001008",   
            },
            "CF":{ #郑棉
                'Market':"069001008",
            },    
            "IF":{ #沪深300股指
                "Market": "069001009",
            }, 
            "IC": { #中证500期货
                "Market": "069001009",
            },
            "IH": { #上证50期货
                "Market": "069001009",
            },  
            # "A": { #豆一
            #     'Market': "069001007",
            #     'code': 'ag'
            # },
            # "B": { #豆二
            #     'Market': "069001007",
            #     'code': 'ag'
            # },            
            # "C": {#玉米
            #     'Market': "069001007",
            #     'code': 'ag'
            # },
            # "CS": { #淀粉
            #     'Market': "069001007",
            #     'code': 'ag'
            # },            
            # "PP": { #PP
            #     'Market': "069001007",
            #     'code': 'ag'
            # },
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
            #"T": { 十债
            #    "Market": "069001009",
            #},           
            #"TF": { 五债
            #    "Market": "069001009",
            #},                   
            #"TS": { #二债
            #    "Market": "069001009",
            #},           
            #"LR":{  #晚稻
             #   "Market":"****"
            #},
            #"RS": { #菜籽
            #    'Market': "069001005",
            #},

    }
    return market[key]["Market"]
        

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





    






