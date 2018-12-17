from flask import Flask, request, url_for, jsonify
from app import app
from dateutil import parser
from scrapers.svt import get_news_selected_regions
from datetime import datetime, date
from scrapers.data.svt_globals import used_regions
from app.threads import thread_get_news, thread_livenews
import requests
import json
import time
from time import sleep

from multiprocessing import Process

from pytz import timezone

stockholm = timezone('Europe/Stockholm')

@app.route('/getnews/daterange/thread', methods=['POST'])
def get_date_ranges_thread():

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

        from_ = from_.replace(tzinfo=stockholm)

        process = Process(target=thread_get_news, args=(from_, until_))
        process.start()

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

live_active = False
start_active = None

def live_news_active():

    global start_active

    while live_active:
        sleep(30)
        now = datetime.now()
        thread_livenews(start_active, now)
        start_active = now

@app.route('/livenews', methods=['GET'])
def live_news():
    global live_active
    global start_active

    live_active = True
    start_active = datetime.now()

    process = Process(target=live_news_active)
    process.start()

    return "Started live news!"