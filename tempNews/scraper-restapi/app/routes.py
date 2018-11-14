from flask import render_template, request, jsonify
from app import app
from dateutil import parser
from scrapers.svt import svt_scraping as ss
import json
import time
import asyncio

loop = asyncio.get_event_loop()
#scheduler = asyncio.AsyncIOScheduler()
#scheduler.add_job(demo_async, args=[URL_LIST], trigger='interval', seconds=15)
#scheduler.start()


async def post_news(from_, until_):
    news_list = await ss.get_news_time_range(from_, until_)
    jsonify(news_list)
    return '{ "hello1" : "world" }'

async def post_return():
    print ("wtf")
    return '{ "hello2" : "world" }'


@app.route('/')
@app.route('/index')
def index():
    user = {'username': 'Roberto'}
    return render_template('index.html', title='El gringo', user=user)

@app.route('/getnewstimerange', methods=['POST'])
def get_news_time_range():
    from_ = request.form['from']
    until_ = request.form['until']
    from_ = parser.parse(from_)
    until_ = parser.parse(until_)
    
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    
    asyncio.ensure_future(post_news(from_, until_))  
    asyncio.ensure_future(post_return())
    loop.run_until_complete(post_news(from_, until_))
    #return '{ "hello3" : "world" }'
    #return json.dumps(news_list, indent=4, sort_keys=True, default=str)

@app.route('/get', methods=['GET'])
def get_something():
    return "hello"