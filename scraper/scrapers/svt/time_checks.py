from dateutil import parser
from datetime import datetime, timedelta

from constants import *
import json

import pytz
utc=pytz.UTC


def get_dict(json_obj):
    return json.loads(json_obj)

def check_time(time_to_check, target_time):
    return time_to_check == target_time

def check_newer_time(time_to_check, target_time):
    return time_to_check > target_time

def check_older_time(time_to_check, target_time):
    return time_to_check < target_time

def time_range(time_to_check, target_time, days = 0):
    time_diff = time_to_check - target_time
    time_diff = time_diff / timedelta( days = 1)
    print(time_diff)


def check_json_time(json_news, time_date, choice = LATER):
    global utc
    news_dt = parser.parse(get_dict(json_news)['datetime'])
    news_dt   = news_dt.replace(tzinfo=utc)
    time_date = time_date.replace(tzinfo=utc)   

    if choice == EARLIER:
        return news_dt < time_date
    elif choice == LATER:
        return news_dt > time_date

def check_json_time_range(json_news, from_, until_):
    global utc
    news_dt = parser.parse(get_dict(json_news)['datetime'])
    news_dt   = news_dt.replace(tzinfo=utc)
    from_ = from_.replace(tzinfo=utc)
    until_ = until_.replace(tzinfo=utc)   

    return (news_dt > from_ and news_dt < until_)

def get_time_diff(first_item, last_item):

    # published is the key for datetime in SVT news
    # datetime is the key we use

    if isinstance(first_item, datetime):
        first_dt = first_item.replace(tzinfo=utc)    
    elif 'published' in first_item:
        first_dt = parser.parse(first_item['published'])
    elif 'datetime' in first_item:
        first_dt = parser.parse(first_item['datetime'])
    
    if isinstance(last_item, datetime):
        last_dt = last_item.replace(tzinfo=utc)       
    elif 'published' in last_item:
        last_dt = parser.parse(last_item['published'])
    elif 'datetime' in last_item:
        last_dt = parser.parse(last_item['datetime'])
    
    timedelta = first_dt - last_dt

    return timedelta.days
