from dateutil import parser
from datetime import datetime, timedelta


import json

import pytz
stockholm=pytz.timezone('Europe/Stockholm')
EARLIER = True
LATER = False

BEFORE = True
AFTER = False

def check_time(news, choice, time_date):
    news_dt = parser.parse(news['datetime'])  

    if choice == BEFORE:
        return news_dt < time_date
    elif choice == AFTER:
        return news_dt > time_date

def check_time_range(news, from_, until_):
    news_dt = parser.parse(news['datetime'])

    return (news_dt > from_ and news_dt < until_)

def get_time_diff(first_item, last_item):

    # published is the key for datetime in SVT news
    # datetime is the key we use

    if isinstance(first_item, datetime):
        first_dt = first_item.replace(tzinfo=stockholm) 

    elif 'published' in first_item:
        first_dt = parser.parse(first_item['published'])

    elif 'datetime' in first_item:
        first_dt = parser.parse(first_item['datetime'])
    
    if isinstance(last_item, datetime):
        last_dt = last_item.replace(tzinfo=stockholm) 

    elif 'published' in last_item:
        last_dt = parser.parse(last_item['published'])

    elif 'datetime' in last_item:
        last_dt = parser.parse(last_item['datetime'])
    
    timedelta = first_dt - last_dt

    return timedelta.days
