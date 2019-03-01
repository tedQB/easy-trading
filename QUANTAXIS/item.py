import urllib.request
import urllib.parse
import json
import re


def get_market_own(key):
    market = { 
            "AG":{ 
                'Market': "069001005",
                'code':'ag'
            },
            "AL": {
                'Market': "069001005",
                'code': 'al'
            },
            "AU": {
                'Market': "069001005",
                'code': 'bu'
            },
            "BU": {
                'Market': "069001005",
                'code': 'bu'
            },
            "CU": {
                'Market': "069001005",
                'code': 'cu'
            },
            "FU": {
                'Market': "069001005",
                'code': 'fu'
            },
            "HC": {
                'Market': "069001005",
                'code': 'fu'
            },
            "NI": {
                'Market': "069001005",
                'code': 'ag'
            },
            "PB": {
                'Market': "069001005",
                'code': 'ag'
            },
            "RB": {
                'Market': "069001005",
                'code': 'ag'
            },
            "RU": {
                'Market': "069001005",
                'code': 'ag'
            },
            "SN": {
                'Market': "069001005",
                'code': 'ag'
            },
            "SP": {
                'Market': "069001005",
                'code': 'ag'
            },
            "ZN": {
                'Market': "069001005",
                'code': 'ag'
            },
            "A": {
                'Market': "069001007",
                'code': 'ag'
            },
            "B": {
                'Market': "069001007",
                'code': 'ag'
            },
            "C": {
                'Market': "069001007",
                'code': 'ag'
            },
            "CS": {
                'Market': "069001007",
                'code': 'ag'
            },
            "I": {
                'Market': "069001007",
                'code': 'ag'
            },
                    "J": {
                'Market': "069001007",
                'code': 'ag'
            },
                    "JD": {
                'Market': "069001007",
                'code': 'ag'
            },
                    "JM": {
                'Market': "069001007",
                'code': 'ag'
            },
                    "L": {
                'Market': "069001007",
                'code': 'ag'
            },
                    "M": {
                'Market': "069001007",
                'code': 'ag'
            },
                    "P": {
                'Market': "069001007",
                'code': 'ag'
            },
                    "PP": {
                'Market': "069001007",
                'code': 'ag'
            },
                    "V": {
                'Market': "069001007",
                'code': 'ag'
            },
                    "Y": {
                'Market': "069001007",
                'code': 'ag'
            },
                    "EG": {
                'Market': "069001007",
                'code': 'ag'
            },
            "ZC": {
                'Market': "069001008",
                'code': 'ag'
            },
            "WH": {
                'Market': "069001008",
                'code': 'ag'
            },
            "TA": {
                'Market': "069001008",
                'code': 'ag'
            },
            "SR": {
                'Market': "069001008",
                'code': 'ag'
            },
            "SM": {
                'Market': "069001008",
                'code': 'ag'
            },
            "SF": {
                'Market': "069001008",
                'code': 'ag'
            },
            "RM": {
                'Market': "069001008",
                'code': 'ag'
            },
            "PM": {
                'Market': "069001008",
                'code': 'ag'
            },
            "OI": {
                'Market': "069001008",
                'code': 'ag'
            },
            "MA": {
                'Market': "069001008",
                'code': 'ag'
            },
            "JR": {
                'Market': "069001008",
                'code': 'ag'
            },
            "FG": {
                'Market': "069001008",
                'code': 'ag'
            },
            "CF": {
                'Market': "069001008",
                'code': 'ag'
            },
            "AP": {
                'Market': "069001008",
                'code': 'ag'
            },
            "IF":{ 
                "Market": "069001009",
            }, 
            "IC": {
                "Market": "069001009",
            },
            "IH": {
                "Market": "069001009",
            },
            "T": {
                "Market": "069001009",
            },
            "TF": {
                "Market": "069001009",
            },
            "TS": {
                "Market": "069001009",
            },
            "LR":{ 
                "Market":"****"
            },
            "RS": {
                'Market': "069001005",
            },
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





    






