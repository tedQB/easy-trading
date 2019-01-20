# encoding: utf-8

import requests
import pandas as pd
import json
import interval

class RetailMonitoring():

    __BASE_URL = 'http://datainterface.eastmoney.com/EM_DataCenter/JS.aspx?type=QHCC&sty=QHSYCC&stat=3&fd=2019-01-18&mkt=069001005&code=ag1906&sc=AG&cb=callback&callback=callback&_=1547818454455'
    __MARKET_EMOTION_ZH = ['极度悲观', '悲观', '乐观', '极度乐观', '疯狂']
    __MARKET_EMOTION_EN = ['Extreme Pessimism', 'Pessimism', 'Optimistic', 'Extreme Optimistic', 'Crazy']

    def __init__(self):
        # Load data
        data = self._get_raw_date()
        self._data = self._generate_ts(data)
        # current data
        self._current_data = self._data[-1]
        # set mean
        self._mean = self._data.mean()
        # set std 
        self._std = self._data.std()
        # set min 
        self._min = self._data.min()
        # set max
        self._max = self._data.max()
        # pressimism section
        self._pessimism_section = interval.Interval(self._mean - self._std, self._mean)
        # extreme pressimism section
        self._extreme_pessimism_section = interval.Interval(self._mean - 3* self._std, self._mean - self._std)
        # optimistic section
        self._optimistic = interval.Interval(self._mean, self._mean + self._std)
        # extreme optimistic section
        self._extreme_optimistic = interval.Interval(self._mean + self._std, self._mean + 2 * self._std)
        # crazy
        self._crazy = interval.Interval(self._mean + 2 * self._std, self._mean + 3 * self._std)
        # emoton status

    def _get_raw_date(self):
        content = requests.get(self.__BASE_URL).content
        #raw_date = json.loads(response.text)
        rex = re.compile(r'\w+[(]{1}(.*)[)]{1}')
        content = rex.findall(cont)

        print content;
        '''
        date = raw_date['X'].split(',')
        increment = list(map(float,raw_date['Y'][0].split(',')))
        return {'date': date, 'increment': increment}
        '''

    def _generate_ts(self, data_dict):
        ts = pd.Series(data_dict['increment'], index=pd.to_datetime(data_dict['date']))
        return ts

    def _check_emotion_status(self, data, lang='ZH'):
        if lang == 'ZH':
            emotion_return = self.__MARKET_EMOTION_ZH
        else:
            emotion_return = self.__MARKET_EMOTION_EN
        if data in self._extreme_pessimism_section:
            return emotion_return[0]
        elif data in self._pessimism_section:
            return emotion_return[1]
        elif data in self._optimistic:
            return emotion_return[2]
        elif data in self._extreme_optimistic:
            return emotion_return[3]
        else:
            return emotion_return[4]

    def get_min(self):
        return self._min

    def get_max(self):
        return self._max

    def get_mean(self):
        return self._mean

    def get_current_data(self):
        return self._current_data

    def get_data(self):
        return self._data

    def get_current_emotion_status(self):
        return self._check_emotion_status(self._current_data)

    def get_emotion_status(self, data):
        return self._check_emotion_status(data)

if __name__ == '__main__':
    '''
    rm = RetailMonitoring()
    print('最近一周新增开户数： %s 万' % rm.get_current_data())
    print('当前情绪指数： %s' % rm.get_current_emotion_status())
    print('历史一周最多新增开户数： %s 万' % rm.get_max())
    print('历史一周最少新增开户数： %s 万' % rm.get_min())
    print(rm.get_data())
    '''
