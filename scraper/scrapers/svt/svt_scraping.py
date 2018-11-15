#!/usr/bin/python3.7
# -*- coding: iso-8859-15 -*-
import os, sys, requests, json, math
import numpy as np
from time import sleep
from dateutil import parser
from datetime import datetime, date, time, timedelta
import pytz
utc=pytz.UTC
try:
    # For Python 3.0 and later
    from urllib.request import urlopen
except ImportError:
    # Fall back to Python 2's urllib2
    from urllib2 import urlopen

#html = urlopen("http://www.google.com/")
#print(html.read())

import requests
from bs4 import BeautifulSoup

#import asyncio
from scrapers.svt.svt_region import lokal_names, svt_regions

URL_SVT = "https://www.svt.se/nyheter/lokalt/orebro/liga-misstanks-ligga-bakom-ny-stold-fran-verktygsbil"
URL_SVT2 = "https://www.svt.se/nyheter/lokalt/orebro/kraftig-okning-av-stolder-ur-hantverksbilar"



#api = "https://api.svt.se/nss-api/page/nyheter/lokalt/sormland/?q=auto,limit=12,page=2"
api = "https://api.svt.se/nss-api/page"

#params = "?q=auto"#,limit=5,page="
params = "?q=auto"
param_limit = ",limit="
param_page  = ",page="

EARLIER = True
LATER = False
FIRST = 0
LAST = -1



def get_news(URL, REGION):

    # Initiate the Beautiful soup
    content = urlopen(URL).read()
    soup = BeautifulSoup(content, features='lxml')

    # Get the article part
    main = soup.find(attrs={"class" : "nyh_body__main"})

    # Three texts of the news HEAD - LEAD - BODY
    head = main.find(attrs={"class" : "nyh_article__heading"})
    lead = main.find(attrs={"class" : "nyh_article__lead"})
    body = main.find(attrs={"class" : "nyh_article-body lp_body"})

    # Media of the news
    pict = main.find(attrs={"class" : "lp_track_artikelbild"})

    # Time 
    time = main.find('time')
    date = time['datetime']

    if pict is not None:
        img_url = pict.find(attrs={"class" : "pic__img pic__img--preloaded pic__img--wide "})['src']

    img_url = "fin.jpg"
    # A parser making a datetime from the SVT time convention
    dt = parser.parse(date)


    news = {}
    if head is not None:
        news['title'] = head.text
    if lead is not None:
        news['lead']  = lead.text
    if body is not None:
        news['body']  = body.text
    if dt is not None:
        news['datetime']  = dt
    if img_url is not None:  
        news['imgurl'] = img_url
    news['region'] = REGION
    news['url']   = URL
    json_data = json.dumps(news, indent=4, sort_keys=True, default=str)

    return json_data

def get_api_news():
    pass

def get_county_names():
    f = open("swedish_counties", 'w')

    region_names = map(lambda x: x.split("/"), svt_regions)

    
    for name in region_names:
        f.write(name[3])

    f.close()


def get_lokal_news(URL):

    # Initiate the Beautiful soup
    content = urlopen(URL).read()
    soup = BeautifulSoup(content, features='lxml')

    temp = soup.find_all('article')
    #temp2 = soup.find_all(attrs={"class" : "nyh_feed-grid__list-item"})
    temp = soup.find_all(attrs={"class" : "nyh_teaser"})

    news_list = []
    for elm in temp:
        news_url = URL_SVT + elm.find('a')['href']
        #print(news_url)
        news_list.append(get_news(news_url, "uppsala"))
        
    return news_list

    #print "Size of news:",len(teaser)

# defining a params dict for the parameters to be sent to the API 
#PARAMS = {'address': location } 
#PARAMS = {'limit' : '50', 'page' : '10'}
# sending get request and saving the response as response object 
#r = requests.get(url = URL, params = PARAMS) 

# extracting data in json format 
#data = r.json() 

def reform_api_news(svt_news_list):

    cloud_news = []

    for svt_news in svt_news_list:
        news = {}
        if svt_news['title'] is not None:
            news['title']   = svt_news['title']
        #if svt_news['text'] is not None:
         #   news['lead']    = svt_news['text']

        # Body kanske inte behövs
        #news['body']    = svt_news['text']
        if svt_news['published'] is not None:
            news['datetime']  = svt_news['published']
        #news['imgurl']  = svt_news['title']
        if svt_news['sectionDisplayName'] is not None:
            news['location']  = { "county" : svt_news['sectionDisplayName'] }
        if svt_news['teaserURL'] is not None:
            news['url']     = svt_news['teaserURL']
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
    #print("PageNumber: ", page)
    params_struct = params + param_limit + str(amount) + param_page + str(page)   
    URL_REGION = api + region + params_struct
    r = requests.get(url = URL_REGION)
    
    region_news = r.json(encoding='utf-8')

    #region_news = region_news['auto']['content']
    region_news = reform_api_news(region_news['auto']['content'])
    #print (region_news[0], len(region_news))

    #print URL_REGION, " amoun: "#, region_news[region]
    return region_news

def get_lokal_api_object(region = "/nyheter/lokalt/uppsala/", amount = 50, page = 0):
    params_struct = params + param_limit + str(amount) + param_page + str(page)   
    URL_REGION = api + region + params_struct
    r = requests.get(url = URL_REGION)
    
    api_obj = r.json(encoding='utf-16')
    
    return api_obj

URL_SVT = "https://www.svt.se"

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
    #print ("News DT: ", news_dt, "Time: ", time_date)
    #news_dt = utc.localize(news_dt) 
    #time_date = utc.localize(time_date) 
    news_dt   = news_dt.replace(tzinfo=utc)
    time_date = time_date.replace(tzinfo=utc)   

    if choice == EARLIER:
        #if news_dt < time_date:
            #print ("The news is earlier")
        return news_dt < time_date
    elif choice == LATER:
        #if news_dt > time_date:
            #print ("The news is later")
        return news_dt > time_date

def check_json_time_range(json_news, from_, until_):
    global utc
    news_dt = parser.parse(get_dict(json_news)['datetime'])
    #print ("News DT: ", news_dt, "Time: ", time_date)
    #news_dt = utc.localize(news_dt) 
    #time_date = utc.localize(time_date) 
    news_dt   = news_dt.replace(tzinfo=utc)
    from_ = from_.replace(tzinfo=utc)
    until_ = until_.replace(tzinfo=utc)   

    return (news_dt > from_ and news_dt < until_)

def get_dict(json_obj):
    return json.loads(json_obj)


def get_time_diff(first_item, last_item):

    if isinstance(first_item, datetime):
        first_dt = first_item.replace(tzinfo=utc)    
    else:
        first_dt = parser.parse(first_item['published'])
    
    if isinstance(last_item, datetime):
        last_dt = last_item.replace(tzinfo=utc)       
    else:
        last_dt  = parser.parse(last_item['published'])

    
    timedelta = first_dt - last_dt

    return timedelta.days

def get_news_time_range(from_, until_):
    global svt_regions
    selected_news = []
    #svt_regions = np.array(svt_regions)
    #svt_regions = svt_regions[1]
    svt_regions = [svt_regions[10], svt_regions[13], svt_regions[7], svt_regions[19], svt_regions[5], svt_regions[8]]
    print (svt_regions)
    for region in svt_regions:
        # Get max page info from this region
        start_obj = get_lokal_api_object(region = region)
        items = start_obj['auto']['pagination']['totalAvailableItems']
        items = int(items)
        max_pages = math.ceil(items / 50)
        print( "Maxpage: ", max_pages)

        obj_list = start_obj['auto']['content']
        #print(obj_list[0]['published'])
        page = get_time_diff(obj_list[0], obj_list[-1]) + 2

        time_diff = get_time_diff(obj_list[0], until_)

        #print("TimeDiff in days:", time_diff, "Days per Page:", page, "Suggested Starting Page:", time_diff/page)
        start_page = math.floor(time_diff/page)

        #test_obj = get_lokal_api_object(page = start_page)

        #sleep(60)
        


        # The loops starts with the most recent news, ends with the oldest
        # Might need to add a waiting
        # rannge( target + 1) gives the "target" - value in the end
        
        for page_nmr in range(start_page,max_pages):
            news_list = get_lokal_api_news(region = region, page = page_nmr)

            print("Page: ", page_nmr, "  datetime: ", get_dict(news_list[FIRST])['datetime'], " Len: ", len(news_list))
            #print("Page: ", page_nmr, "  datetime: ", get_dict(news_list[LAST])['datetime'], " Len: ", len(news_list))
            # Check if the last item is newer then the until time limit
            #oldest_news_dt = parser.parse(get_dict(news_list[LAST])['datetime'])
            if check_json_time(news_list[LAST], until_, LATER):
                continue
            elif check_json_time(news_list[FIRST], from_, EARLIER):
                break
            else:
                selected_news += filter(lambda x: check_json_time_range(x, from_, until_), news_list)

    

    # list with JSON object satisfying the time range
    return selected_news

def post_news(json_news, URL):
    r = requests.post("http://bugs.python.org", json = json_news)
    print(r.status_code, r.reason)

    print(r.text[:300] + '...')
    print(r.json)

def print_json(json_str):

    json_obj = json.loads(json_str)

    for elm in json_obj:
        print( elm[:6], "\t: \t",json_obj[elm][0:40])

    print ("")



def main():
    from_  = datetime(2017, 12, 30)
    until_ = datetime(2018, 1, 1)
    #get_county_names()
    api_obj = get_news_time_range(from_, until_)

    # String object
    #print (type(api_obj[FIRST]), api_obj[FIRST])
    # JSON object
    #print (type(json.loads(api_obj[FIRST])), json.loads(api_obj[FIRST]))


    print ("First object: ", json.loads(api_obj[FIRST])['datetime'])
    #print("Last object: ", json.loads(api_obj[LAST])['datetime'])

    #post_news(json.loads(api_obj[FIRST]), "wepage")


    #region_news = get_lokal_api_news( page = 363)

    #news_json = json.loads(region_news[-1])
    #print (news_json['title'])
    #print type(cloud_news)
    #news_info = []

    #for region in cloud_news:

    #dt = parser.parse(news['datetime'])
    
        #print cloud_news[0]
    #URL = "https://www.svt.se/nyheter/lokalt/uppsala/?autosida=1#auto--12"
    #news_list = get_lokal_news(URL_SVT)

    #for news in news_list:
    #    print news
    #print "Uppsala has this many news",len(news_list)
    #print get_news(URL_SVT, "uppsala")





if __name__ == "__main__":
    main() 