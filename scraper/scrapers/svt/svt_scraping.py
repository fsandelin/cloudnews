#!/usr/bin/python3.7
# -*- coding: iso-8859-15 -*-
import os, sys, requests, json, math
from time import sleep
from dateutil import parser
from datetime import datetime, date, time, timedelta


import uuid
import random

from bs4 import BeautifulSoup


from flask import jsonify
import pytz
UTC=pytz.UTC

try:
    # For Python 3.0 and later
    from urllib.request import urlopen
except ImportError:
    # Fall back to Python 2's urllib2
    from urllib2 import urlopen

try:
    # If runing from restapi
    from scrapers.svt.svt_region import svt_regions, used_regions
    from scrapers.svt.svt_web_scraping import *
    from scrapers.svt.time_checks import *
    from scrapers.svt.constants import *
except ImportError:
    from svt_region import svt_regions, used_regions
    from svt_web_scraping import *
    from time_checks import *
    from constants import *


def get_lokal_news(URL):

    # Initiate the Beautiful soup
    content = urlopen(URL).read()
    soup = BeautifulSoup(content, features='lxml')

    temp = soup.find_all('article')
    temp = soup.find_all(attrs={"class" : "nyh_teaser"})

    news_list = []
    for elm in temp:
        news_url = URL_SVT + elm.find('a')['href']

        news_list.append(get_news(news_url, "uppsala"))
        
    return news_list

def reform_api_news(svt_news_list):

    cloud_news = []

    for svt_news in svt_news_list:
        news = {}
        #print(svt_news['image'])
        # Extract the wanted information
        if 'title'              in svt_news:
            news['title']       = svt_news['title']

        if 'published'          in svt_news:
            news['datetime']    = svt_news['published']

        if 'sectionDisplayName' in svt_news:
            news['location']    = { "county" : svt_news['sectionDisplayName'] }

        if 'teaserURL'          in svt_news:
            news['url']         = svt_news['teaserURL']

        if 'image'              in svt_news:
            news['imgurl']      = svt_news['image']['url']

        news['id'] = str(uuid.uuid4())
        news['source']  = 'svt'
        json_news = json.dumps(news, indent=4, sort_keys=True, default=str)
        cloud_news.append(json_news)

    return cloud_news

def reform_api_news_scrape(svt_news_list):
    cloud_news = []
    for svt_news in svt_news_list:
        URL = svt_news['teaserURL']
        REGION = svt_news['sectionDisplayName']
        cloud_news.append(get_news(URL, REGION))

    return cloud_news


def get_lokal_api_news(region = "/nyheter/lokalt/uppsala/", amount = 50, page = 0): 
    global params
    params_struct = params + param_limit + str(amount) + param_page + str(page)   
    URL_REGION = api + region + params_struct
    r = requests.get(url = URL_REGION)
    
    region_news = r.json(encoding='utf-8')

    region_news = reform_api_news(region_news['auto']['content'])

    return region_news

def get_lokal_api_object(region = "/nyheter/lokalt/uppsala/", amount = 50, page = 0):
    params_struct = params + param_limit + str(amount) + param_page + str(page)   
    URL_REGION = api + region + params_struct
    r = requests.get(url = URL_REGION)
    
    api_obj = r.json(encoding='utf-16')
    
    return api_obj

def get_news_time_range_region(region, from_, until_):
    # Get max page info from this region
    start_obj = get_lokal_api_object(region = region)
    items = start_obj['auto']['pagination']['totalAvailableItems']
    items = int(items)
    max_pages = math.ceil(items / 50)

    print( "{}{:20}{}{}".format("Region: ", start_obj['auto']['content'][0]['sectionDisplayName'], "pages: ", max_pages))

    obj_list = start_obj['auto']['content']
    page = get_time_diff(obj_list[0], obj_list[-1]) + 2

    time_diff = get_time_diff(obj_list[0], until_)

    start_page = math.floor(time_diff/page)

    # page 1 is the starting page, anything lower also works but is redundant        
    if start_page < 1:
        start_page = 1

    selected_news = []
    # The loops starts with the most recent news, ends with the oldest
    # Might need to add a waiting
    # range( target + 1) gives the "target" - value in the end
    
    for page_nmr in range(start_page,max_pages):
        news_list = get_lokal_api_news(region = region, page = page_nmr)

        print("Page: ", page_nmr, "  datetime: ", get_dict(news_list[FIRST])['datetime'], " Len: ", len(news_list))
        # Check if the last item is newer then the until time limit
        if check_json_time(news_list[LAST], until_, LATER):
            continue
        elif check_json_time(news_list[FIRST], from_, EARLIER):
            break
        else:
            selected_news += filter(lambda x: check_json_time_range(x, from_, until_), news_list)

    print("")
    return selected_news

def get_news_time_range(from_, until_):
    global used_regions

    selected_news = []
    svt_regions = used_regions
    print (svt_regions)
    for region in svt_regions:     
        selected_news += get_news_time_range_region(region, from_, until_) 

    # list with JSON object satisfying the time range
    return selected_news

def get_news_selected_regions(regions, from_, until_):
    selected_news = []
    for region in regions:
        selected_news += get_news_time_range_region(region, from_, until_)
    return selected_news

def post_news(json_news, URL):

    headers = {
    'Content-Type': "application/json",
    'cache-control': "no-cache"
    }

    if json_news[0] is not None:
        print(json_news[0])

    json_news = [json.loads(news) for news in json_news]
    
    r = requests.post(URL,  json = json_news[3], params = {"service": "tt" }, headers = headers)
    print(r.status_code, r.reason)

    print(r.text[:300] + '...')
    print(r.json)

def print_json(json_str):

    json_obj = json.loads(json_str)

    for elm in json_obj:
        print( elm[:6], "\t: \t",json_obj[elm][0:40])

    print ("")


def random_posts(news_list):
    headers = {
    'Content-Type': "application/json",
    'cache-control': "no-cache"
    }
    URL = "http://localhost:3000"
    news_index = 0
    max_index  = len(news_list)
    while True:

        news_index += random.randint(1,5)
        if news_index >= max_index:
            break
        r = requests.post(URL,  json = news_list[news_index], params = {"service": "tt" }, headers = headers)
        print ("News index:", news_index)
        sleep(0.5 + random.random())
        pass
    pass

def presenting_representing():
    # Choose which regions, connected to counties
    # get the latest two weeks
    # now - 2 weeks (14days)

    global used_regions
    
    #used_regions = [svt_regions[0],svt_regions[1]]

    until_ = datetime.now()
    from_  = until_ - timedelta(days = 5)

    # Collect all news in a list
    news_list = get_news_selected_regions(used_regions, from_, until_)
    
    # collect region names from the news, or store in different lists
    news_dict_list = []
    region_names = set()
    for news in news_list:
        news_dict = json.loads(news)
        news_dict_list.append(news_dict)
        region_names.add(news_dict['location']['county'])


    print ("Total news:", len(news_list), "\tdatetime type:", type(json.loads(news_list[0])['datetime']))
    # order by time

    # generate post commands towards the middleware at random times
    news_sorted_date = sorted(news_dict_list, key=lambda x: parser.parse(x['datetime']))

    #for news in news_sorted_date:
    #    print ("{:30}{:15}{:.20}".format(news['datetime'], news['location']['county'], news['title']))

    random_posts(news_sorted_date)
    pass

def test_time_range():
    from_  = datetime(2017, 12, 30)
    until_ = datetime(2018, 1, 1)
    api_obj = get_news_time_range(from_, until_)


    post_news(api_obj, "http://localhost:3000")
    print ("First object: ", json.loads(api_obj[FIRST])['datetime'])

def get_api_obj():
    print(get_lokal_api_object())

def main():
    presenting_representing()

if __name__ == "__main__":
    main() 