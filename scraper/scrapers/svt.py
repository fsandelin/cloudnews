#!/usr/bin/python3.7
# -*- coding: iso-8859-15 -*-
import os
import sys
import requests
import json
import math
import uuid
import random

from time import sleep
from dateutil import parser
from datetime import datetime, date, time, timedelta
from bs4 import BeautifulSoup
from .retry_decorator import retry
#from flask import jsonify

import pytz
UTC=pytz.UTC

import asyncio
import concurrent.futures

from multiprocessing import Pool

try:
    # For Python 3.0 and later
    from urllib.request import urlopen, HTTPError
except ImportError:
    # Fall back to Python 2's urllib2
    from urllib2 import urlopen, HTTPError

if __name__ == "__main__":
    from data.svt_globals import URL_SVT, URL_API, svt_regions, used_regions, param_limit, param_page, params
    from util.location_search import search_cloud_news
    from data.constants import FIRST, LAST, LATER, EARLIER, BEFORE, AFTER
    from util.time_checks import *
else:
    from scrapers.data.svt_globals import URL_SVT, URL_API, svt_regions, used_regions, param_limit, param_page, params
    from scrapers.data.constants import FIRST, LAST, LATER, EARLIER, BEFORE, AFTER
    from scrapers.util.location_search import search_cloud_news
    from scrapers.util.time_checks import *



BEFORE = True
AFTER = False





def check_svt_name(name):
    if name == 'Väst':
        return 'Västra Götaland'

    if name == 'Sörmland':
        return 'Södermanland'

    if name == 'Öst':
        return 'Östergötland'

    return name

@retry(Exception, tries=10, delay=1, backoff=2)
def get_url(url):
    return urlopen(url)

def get_news(url, region, response = None, print_thing = False):


    # Initiate the Beautiful soup
    if response is None:
        response = get_url(url)
        content = response.read()
    else:
        content = response.read()

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

    if time is not None:
        date = time['datetime']
    else:
        print(str(datetime.now()), str(datetime(1970, 1, 1)))
        date = str(datetime(1970, 1, 1))

    img_url = None
    if pict is not None:
        img_class = pict.find(attrs={"class" : "pic__img pic__img--preloaded pic__img--wide "})
        if img_class is not None:
            img_url = img_class['src']

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

    region = check_svt_name(region)
    news['location'] = {}
    news['location']['county'] = region
    news['location']['country'] = "Sweden"
    news['source'] = "svt"
    news['url']   = url

    return news

class News:

    def __init__(self, url, region_name):
        self.url = url
        self.region_name = region_name
        self.tries = 5
        self.retry = False
        self.news = None
        self.sleeptime = 0.1

    def request_news(self):
        if self.tries > 0:
            self.tries -= 1
            try:
                response = urlopen(self.url)
                self.news = get_news(self.url, self.region_name, response, True)
            except HTTPError as e:
                response = None
                if e.code == 503:
                    self.retry = True
                    self.news = None
                else:
                    print(e.code)
        else:
            self.retry = False

    def get_news(self):
        return self.news

def reform_api_news(svt_news_list):
    cloud_news = []

    for svt_news in svt_news_list:
        news = {}
        # Extract the wanted information
        if 'title'              in svt_news:
            news['title']       = svt_news['title']

        if 'vignette'           in svt_news:
            news['lead']        = svt_news['vignette']

        if 'text'               in svt_news:
            news['body']        = svt_news['text']

        if 'published'          in svt_news:
            news['datetime']    = svt_news['published']

        if 'sectionDisplayName' in svt_news:
            county = check_svt_name(svt_news['sectionDisplayName'])
            news['location']    = { 'county' : county , 'country' : 'Sweden'}

        if 'teaserURL'          in svt_news:
            news['url']         = svt_news['teaserURL']

        if 'image'              in svt_news:
            news['imgurl']      = svt_news['image']['url']


        news['id'] = str(uuid.uuid4())
        news['source']  = 'svt'
        cloud_news.append(news)

    return cloud_news

def reform_api_news_scrape(svt_news_list):
    cloud_news = []
    for svt_news in svt_news_list:
        URL = svt_news['teaserURL']
        REGION = svt_news['sectionDisplayName']
        cloud_news.append(get_news(URL, REGION))

    return cloud_news

@retry(Exception, tries=10, delay=0.1, backoff=1.5)
def get_request(url):
    return requests.get(url=url)

def get_api_news_region(region="/nyheter/lokalt/uppsala/", page=0, amount=50):
    params_struct = params + param_limit + str(amount) + param_page + str(page)
    url = URL_API + region + params_struct
    response = get_request(url)
    
    region_news = response.json(encoding='utf-16')

    region_news = reform_api_news(region_news['auto']['content'])
    return region_news

def get_api_object(region="/nyheter/lokalt/uppsala/", page=0, amount=50):
    params_struct = params + param_limit + str(amount) + param_page + str(page)
    url = URL_API + region + params_struct
    response = get_request(url)

    region_news = response.json(encoding='utf-16')

    return region_news

def check_start_page(until_, region, page):
    news_list = get_api_news_region(region=region, page=page)
    found = False
    value = -1
    if len(news_list) == 0:
        print("its empty")
        return(found, value, page, "start")
    if check_time(news_list[FIRST], BEFORE, until_):
        found = False
        value = -1
    elif check_time(news_list[FIRST], AFTER, until_) and check_time(news_list[LAST], BEFORE, until_):
        found = True
        value = 0
    elif not check_time(news_list[FIRST], AFTER, until_):
        found = True
        value = 0
    else:
        found = False
        value = 1
    return (found, value, page, "start")

def check_end_page(from_, region, page):
    news_list = get_api_news_region(region=region, page=page)
    found = False
    value = 1
    if len(news_list) == 0:
        print("its empty")
        return(found, value, page, "end")
    if check_time(news_list[LAST], AFTER, from_):
        found = False
        value = 1
    elif check_time(news_list[FIRST], BEFORE, from_) and check_time(news_list[LAST], AFTER, from_):
        found = True
        value = 0
    elif not check_time(news_list[FIRST], BEFORE, from_):
        found = True
        value = 0
    else:
        found = False
        value = -1
    return (found, value, page, "end")

async def page_threads(from_, until_ , region, start_pages, end_pages, workers):

    with concurrent.futures.ThreadPoolExecutor(max_workers=workers*2) as executor:

        loop = asyncio.get_event_loop()
        futures = [
            loop.run_in_executor(
                executor,
                check_start_page,
                until_,
                region,
                i
            )
            for i in start_pages
        ] + [
            loop.run_in_executor(
                executor,
                check_end_page,
                from_,
                region,
                i
            )
            for i in end_pages
        ]
        response_list = await asyncio.gather(*futures)

    return response_list

def check_in_page(time_to_check, news_list):
    return check_time(news_list[FIRST], AFTER, time_to_check) and check_time(news_list[LAST], BEFORE, time_to_check)
    

def check_if_pages(from_, until_, region):
    # Find if the from and until is in the first 3 pages

    start_page = None
    end_page = None

    for i in range(1,4):
        news_list = get_api_news_region(region, page=i)
        if check_time(news_list[LAST], BEFORE, until_):
            end_page = 1
        if check_time(news_list[LAST], BEFORE, from_):
            start_page = 1

        if check_in_page(from_, news_list):
            start_page = i
        if check_in_page(until_, news_list):
            end_page = i
        if start_page is None or end_page is None:
            continue
        else:
            break

    return (start_page, end_page)

def get_start_end_page(from_, until_, region="/nyheter/lokalt/ost/"):

    workers = 5

    start_obj = get_api_object(region = region)
    items = start_obj['auto']['pagination']['totalAvailableItems']
    items = int(items)
    max_pages = math.ceil(items / 50)

    region_name = start_obj['auto']['content'][0]['sectionDisplayName']
    obj_list = start_obj['auto']['content']

    # Calculating the approriate start_page
    # by see how many days the first page envelops
    days_per_page = get_time_diff(obj_list[0], obj_list[-1]) + 1

    time_diff_start = get_time_diff(obj_list[0], until_)
    time_diff_end = get_time_diff(obj_list[0], from_)

    end_page_found = False
    start_page_found = False

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    start_page, end_page = check_if_pages(from_, until_, region)

    if start_page is not None and end_page is not None:
        
        return (start_page, end_page)

    if start_page is None:
        start_page = math.floor(time_diff_start/days_per_page)
        start_pages = range(start_page, start_page + workers)
    else:
        start_page_found = True
        start_pages = []
    
    if end_page is None:
        end_page = math.floor(time_diff_end/days_per_page)
        end_pages = range(end_page, end_page + workers)
    else:
        end_page_found = True
        end_pages = []

    i = 0
    while i < 20:
        i += 1
        

        responses = loop.run_until_complete(page_threads(from_, until_, region, start_pages, end_pages, workers))

        start_movement = 0
        end_movement = 0

        for response in responses:
            if response[3] == 'start':
                start_movement = response[1]
            elif response[3] == 'end':
                end_movement = response[1]

            if response[3] == 'start' and response[0]:
                start_page_found = True
                start_page = response[2]
            if response[3] == 'end' and response[0]:
                end_page_found = True
                end_page = response[2]

        if not start_page_found:
            if start_movement > 0:
                start_page = start_page + workers
                start_pages = range(start_page, start_page + workers)
            elif start_movement < 0:
                start_page = start_page - workers
                start_pages = range(start_page, start_page + workers)
        else:
            start_pages = []
        if not end_page_found:
            if end_movement > 0:
                end_page = end_page + workers
                end_pages = range(end_page, end_page + workers)
            elif end_movement < 0:
                end_page = end_page - workers
                end_pages = range(end_page, end_page + workers)
        else:
            end_pages = []


        if end_page_found and start_page_found:
            break

    return (start_page, end_page)

def get_news_threads(from_, until_, region, page_nmr):
    news_list = get_api_news_region(region=region, page=page_nmr)
    return filter(lambda x: check_time_range(x, from_, until_), news_list)

async def news_threads(from_, until_, region, page_range):
    workers = 5
    if len(page_range) > 3:
        workers = len(page_range)
    with concurrent.futures.ThreadPoolExecutor(max_workers=workers) as executor:
        loop = asyncio.get_event_loop()
        futures = [
            loop.run_in_executor(
                executor,
                get_news_threads,
                from_,
                until_,
                region,
                page
            )
            for page in page_range
        ]
        news_list = []
        for news in await asyncio.gather(*futures):
            news_list += news
    return news_list

def get_news_region_thread(from_, until_, region):

    start_page, end_page = get_start_end_page(from_, until_, region)

    page_range = range(start_page, end_page + 1)
    loop = asyncio.get_event_loop()
    news_list = loop.run_until_complete(news_threads(from_, until_, region, page_range))

    news_list = [ele for ele in news_list if 'Nyheter från dagen' not in ele['title']]

    return news_list

def get_news_selected_regions_threads(from_, until_, regions=svt_regions):
    selected_news = []
    p = Pool()
    arguments = [(from_, until_, region) for region in regions]
    result = p.starmap(get_news_region_thread, arguments)
    return result

def get_news_region(from_, until_, region, use_web = False):


    selected_news = []

    # Get max page info from this region
    start_obj = get_api_object(region = region)
    items = start_obj['auto']['pagination']['totalAvailableItems']
    items = int(items)
    max_pages = math.ceil(items / 50)

    print( "{}{:20}{}{}".format("Region: ", start_obj['auto']['content'][0]['sectionDisplayName'], "pages: ", max_pages))
    region_name = start_obj['auto']['content'][0]['sectionDisplayName']
    obj_list = start_obj['auto']['content']

    # Calculating the approriate start_page
    # by see how many days the first page envelops
    days_per_page = get_time_diff(obj_list[0], obj_list[-1])
    time_diff = get_time_diff(obj_list[0], until_)
    start_page = math.floor(time_diff/days_per_page)

    # page 1 is the starting page, anything lower also works but is redundant
    if start_page < 1:
        start_page = 1


    # The loops starts with the most recent news, ends with the oldest
    page_nmr = start_page
    can_start = False
    while True:

        if page_nmr > max_pages:
            break

        # This itterates backwards to find the starting position,
        # its a precaution for an underestimated days_per_page
        if page_nmr <= start_page and page_nmr >= 2 and not can_start:
            news_list = get_api_news_region(region=region, page=page_nmr)
            print("Page: ", page_nmr, "  datetime: ", news_list[FIRST]['datetime'], " vs:", until_)
            if check_time(news_list[FIRST], BEFORE, until_):
                page_nmr -= 1
                continue
            else:
                can_start = True

        news_list = get_api_news_region(region=region, page=page_nmr)

        print("Page: ", page_nmr, "  datetime: ", news_list[FIRST]['datetime'], " Len: ", len(news_list))

        # Check if the last item is newer then the until time limit
        if check_time(news_list[LAST], AFTER, until_):
            page_nmr += 1
            continue
        elif check_time(news_list[FIRST], BEFORE, from_):
            break
        else:
            page_nmr += 1
            selected_news += filter(lambda x: check_time_range(x, from_, until_), news_list)



    news_list = [ele for ele in selected_news if 'Nyheter från dagen' not in ele['title']]
    print("Amount of news:", len(news_list))
    news_list = [search_cloud_news(ele) for ele in news_list]
    amount = 0
    located_news = []

    for found, ele in news_list:
        if not found and use_web:
            temp_news = get_news(ele['url'], region_name)
            temp_news = search_cloud_news(temp_news)[1]
            ele['location'] = temp_news['location']
        if 'city' in ele['location']:
            amount += 1
        located_news.append(ele)

    print("Amount of found cities:", amount)
    print("")
    return located_news

def get_news_selected_regions(from_, until_, regions=used_regions):
    selected_news = []
    for region in regions:
        selected_news += get_news_region(from_, until_, region)
    return selected_news


class Page:

    def __init__(self, region, page_nmr):
        params_struct = params + param_limit + str(50) + param_page + str(page_nmr)
        self.url_call = URL_API + region + params_struct
        self.tries = 5
        self.news = None

    def request_news(self):
        if self.tries > 0:

            self.tries -= 1
            r = requests.get(url = self.url_call)

            if r.status_code == 200:
                self.complete = True
                region_news = r.json()
                self.news = reform_api_news(region_news['auto']['content'])

            elif r.status_code == 503:
                self.complete = False

            else:
                self.complete = True
                self.news = []

        else:
            self.complete = True
            self.news = []

    def get_news(self):
        return self.news