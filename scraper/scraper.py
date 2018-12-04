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
from scrapers.svt import get_news_selected_regions, get_api_object, get_start_end_page, get_news_selected_regions_threads, get_news

import asyncio
import concurrent.futures

from multiprocessing import Pool

def post_news(json_news, URL):

    headers = {
    'Content-Type': "application/json",
    'cache-control': "no-cache"
    }

    if json_news[0] is not None:
        print(json_news[0])

    json_news = [json.loads(news) for news in json_news]
    
    r = requests.post(URL,  json = json_news[3], params = {"service": "svt" }, headers = headers)
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

    until_ = datetime.now()
    from_  = until_ - timedelta(days = 14)

    # Collect all news in a list
    news_list = get_news_selected_regions(from_, until_,used_regions[:1])

    print("News:", len(news_list))
    news_list = [json.dumps(ele, indent=4, sort_keys=True, default=str) for ele in news_list]

    # collect region names from the news, or store in different lists
    news_dict_list = []
    region_names = set()
    for news in news_list:
        news_dict = json.loads(news)
        news_dict_list.append(news_dict)
        region_names.add(news_dict['location']['county'])


    print ("Total news:", len(news_list), "\tdatetime type:", type(json.loads(news_list[0])['datetime']))

    # generate post commands towards the middleware at random times
    news_sorted_date = sorted(news_dict_list, key=lambda x: parser.parse(x['datetime']))


    print ("{:30}{:15}{:.20}".format(news['datetime'], news['location']['county'], news['title']))

    random_posts(news_sorted_date)

def test_time_range():
    from_  = datetime(2017, 12, 30)
    until_ = datetime(2018, 1, 1)
    api_obj = get_news_time_range(from_, until_)

    post_news(api_obj, "http://localhost:3000")
    print ("First object: ", json.loads(api_obj[FIRST])['datetime'])

def get_api_obj():
    print(get_api_object())

def test_page():
    until_ = datetime.now()
    from_  = until_ - timedelta(days = 14)
    until_ = datetime(2017,2,11)
    from_ = datetime(2017,1,12)
    pages = get_start_end_page(from_, until_)
    print(pages)

def test_threads():
    until_ = datetime(2018,11,11)
    from_ = datetime(2018,11,10)
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
        temp_news = get_news(news['url'], news['location']['county'])
        temp_news = search_cloud_news(temp_news)[1]
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
    loop = asyncio.get_event_loop()
    news_list = loop.run_until_complete(locate_threads(news_list))
    return news_list


def locate_news(news_list):
    p = Pool()
    result = p.map(locate_process, news_list)
    return result


def main():
    news_list = test_threads()

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


if __name__ == "__main__":
    main() 