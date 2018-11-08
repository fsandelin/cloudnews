#!/usr/bin/python
# -*- coding: iso-8859-15 -*-
import os, sys, requests, json

from dateutil import parser
from datetime import datetime, date, time, timedelta

import urllib2
from bs4 import BeautifulSoup


from svt_region import lokal_names, svt_regions

URL_SVT = "https://www.svt.se/nyheter/lokalt/orebro/liga-misstanks-ligga-bakom-ny-stold-fran-verktygsbil"
URL_SVT2 = "https://www.svt.se/nyheter/lokalt/orebro/kraftig-okning-av-stolder-ur-hantverksbilar"



api = "https://api.svt.se/nss-api/page/nyheter/lokalt/sormland/?q=auto,limit=12,page=2"
api = "https://api.svt.se/nss-api/page"

params = "?q=auto"#,limit=5,page="


def get_news(URL, REGION):

    # Initiate the Beautiful soup
    content = urllib2.urlopen(URL).read()
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


def get_lokal_news(URL):

    # Initiate the Beautiful soup
    content = urllib2.urlopen(URL).read()
    soup = BeautifulSoup(content, features='lxml')

    temp = soup.find_all('article')
    #temp2 = soup.find_all(attrs={"class" : "nyh_feed-grid__list-item"})
    temp = soup.find_all(attrs={"class" : "nyh_teaser"})

    news_list = []
    for elm in temp:
        news_url = URL_SVT + elm.find('a')['href']
        print news_url
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
        news['title']   = svt_news['title']
        news['lead']    = svt_news['text']

        # Body kanske inte behövs
        #news['body']    = svt_news['text']

        news['datetime']  = svt_news['published']
        #news['imgurl']  = svt_news['title']
        news['region']  = svt_news['sectionDisplayName']
        news['url']     = svt_news['teaserURL']
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

param_limit = ",limit="
param_page  = ",page="
def get_lokal_api_news(URL, amount = 5, page = 0): 
    global params
    region_news = {}
    params_struct = params + param_limit + str(amount) + param_page + str(page)
    for region in svt_regions:
        URL_REGION = api + region + params_struct
        r = requests.get(url = URL_REGION)
        
        region_news[region] = r.json(encoding='utf-16')
        print region_news[region]['auto']['content'][0]['section'], len(region_news[region]['auto']['content'])
        #print URL_REGION, " amoun: "#, region_news[region]
    return region_news


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
    print time_diff


def print_json(json_str):

    json_obj = json.loads(json_str)

    for elm in json_obj:
        print elm[:6], "\t: \t",json_obj[elm][0:40]

    print ""



def main():
    region_news = get_lokal_api_news(api, amount = 10, page = 0)

    cloud_news = []

    for region in region_news:
        cloud_news.append(reform_api_news(region_news[region]['auto']['content']))

    for region in cloud_news:
        for news in region:
            print_json(news)
    
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