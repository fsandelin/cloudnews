from flask import Flask, request, url_for, jsonify
from app import app
from dateutil import parser
#from scrapers.svt import svt_scraping as ss
from scrapers.svt import get_news_selected_regions
from datetime import datetime, date
from scrapers.data.svt_globals import used_regions
from scraper import thread_get_news
import requests
import json
import time
from time import sleep

from multiprocessing import Process

def f(name):
    for i in range(10):
        sleep(1)
        print('hello', name)

@app.route('/test', methods=['POST'])
def test():
    p = Process(target=f, args=('filip',))
    p.start()
    return "done"


@app.route('/getnews/daterange/thread', methods=['POST'])
def get_date_ranges():

    content = request.get_json()
    
    news_list = []

    for timespan in content:
        print(timespan)
        from_ = timespan['from']
        until_ = timespan['until']
        from_ = parser.parse(from_)
        until_ = parser.parse(until_)

        from_ = datetime.combine(from_.date(), datetime.min.time())
        until_ = datetime.combine(until_.date(), datetime.max.time())

        p = Process(target=thread_get_news, args=(from_, until_))
        p.start()

    return jsonify('message: started scraping')

@app.route('/getnews/daterange', methods=['POST'])
def get_date_ranges():

    content = request.get_json()
    
    news_list = []

    for timespan in content:
        print(timespan)
        from_ = timespan['from']
        until_ = timespan['until']
        from_ = parser.parse(from_)
        until_ = parser.parse(until_)

        from_ = datetime.combine(from_.date(), datetime.min.time())
        until_ = datetime.combine(until_.date(), datetime.max.time())

        p = Process(target=get_news_selected_regions, args=(from_, until_))
        p.start()

    return jsonify('message: started scraping')

@app.route('/getnews/daterange2', methods=['POST'])
def get_news_date_range():
    from_ = request.form['from']
    until_ = request.form['until']
    from_ = parser.parse(from_)
    until_ = parser.parse(until_)

    from_ = datetime.combine(from_.date(), datetime.min.time())
    until_ = datetime.combine(until_.date(), datetime.max.time())

    news_list = get_news_selected_regions(from_, until_)
    
    return jsonify(news_list)

@app.route('/getnews/timerange', methods=['POST'])
def get_news_time_range():
    from_ = request.form['from']
    until_ = request.form['until']
    from_ = parser.parse(from_)
    until_ = parser.parse(until_)

    news_list = get_news_selected_regions(from_, until_)
    
    return jsonify(news_list)

@app.route('/livenews', methods=['GET'])
def live_news():
    today = date.today()

    from_ = datetime.combine(today, datetime.min.time())
    until_ = datetime.combine(today, datetime.max.time())
    news_list = get_news_selected_regions(from_, until_)
    
    return jsonify(news_list)
