import json
import requests
import random
from time import sleep, time
from app import app

from dateutil import parser
from datetime import datetime, timedelta

from scrapers.util.location_search import search_cloud_news
from scrapers.data.constants import FIRST, LAST
from scrapers.data.svt_globals import used_regions
from scrapers.svt import get_news_selected_regions, get_api_object, get_start_end_page, get_news_selected_regions_threads, get_news, News

import asyncio
import concurrent.futures

from multiprocessing import Pool


def post_timespan(from_, until_, news_list, service="svt"):

    URL = "http://localhost:3030/api/fill_timespan"

    body = {}

    body['service'] = service
    body['timespan'] = {'from' : str(from_), 'until' : str(until_)}
    body['news'] = news_list

    try:
        requests.post(URL, json = body)
    except requests.RequestException as e:
        print(e)

def post_livenews(from_, until_, news_list, service="svt"):

    URL = "http://localhost:3030/api/live_news"

    body = {}

    body['service'] = service
    body['timespan'] = {'from' : str(from_), 'until' : str(until_)}
    body['news'] = news_list

    try:
        requests.post(URL, json = body)
    except requests.RequestException as e:
        print(e)

def get_api_obj():
    print(get_api_object())

def test_page():
    until_ = datetime.now()
    from_  = until_ - timedelta(days = 14)
    until_ = datetime(2017,2,11)
    from_ = datetime(2017,1,12)
    pages = get_start_end_page(from_, until_)
    print(pages)

def test_threads(from_, until_):
    start_time = time()
    news_list = get_news_selected_regions_threads(from_, until_)
    news_group = []
    for news in news_list:
        news_group += news
    print("Amount of regions:", len(news_list), "Amount of news:", len(news_group))
    print("--- %s seconds ---" % (time() - start_time))

    return news_list


def locate_single_news(news):    
    found, news = search_cloud_news(news)

    if not found:
        news_obj = News(news['url'], news['location']['county'])
        news_obj.request_news()

        while news_obj.retry:
            sleep(0.1)
            news_obj.request_news()

        if news_obj.news is not None:
            temp_news = search_cloud_news(news_obj.news)[1]
            news['location'] = temp_news['location']

    return news


async def locate_threads(news_list):
    with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
        loop = asyncio.get_event_loop()
        futures = [
            loop.run_in_executor(
                executor, 
                locate_single_news,
                news
            )
            for news in news_list
        ]
        news_list = []
        for news in await asyncio.gather(*futures):
            news_list.append(news)

    return news_list

def locate_process(news_list):
    #loop = asyncio.get_event_loop()
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    news_list = loop.run_until_complete(locate_threads(news_list))
    return news_list


def locate_news(news_list):
    pool = Pool()
    result = pool.map(locate_process, news_list)
    return result

def thread_get_news(from_, until_):
    news_list = test_threads(from_, until_)

    start_time = time()
    news_list = locate_news(news_list)
    

    news_group = []
    for news in news_list:
        news_group += news

    i = 0
    for news in news_group:
        if 'city' in news['location']:
            i += 1

    print("Amoun of regions:", len(news_list), "Amount of news:", len(news_group), "amount of found news:", i)
    print("--- %s seconds ---" % (time() - start_time))


    service = 'svt'
    post_timespan(from_, until_, news_group, service)

def thread_livenews(from_, until_):
    news_list = test_threads(from_, until_)

    start_time = time()
    news_list = locate_news(news_list)
    

    news_group = []
    for news in news_list:
        news_group += news

    i = 0
    for news in news_group:
        if 'city' in news['location']:
            i += 1

    print("Amoun of regions:", len(news_list), "Amount of news:", len(news_group), "amount of found news:", i)
    print("--- %s seconds ---" % (time() - start_time))

    service = 'svt'
    post_livenews(from_, until_, news_group, service)