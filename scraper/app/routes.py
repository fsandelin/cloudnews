from flask import Flask, request, url_for, jsonify
from app import app
from dateutil import parser
from scrapers.svt import svt_scraping as ss

from datetime import datetime

import requests
import json
import time

@app.route('/getnewstimerange', methods=['POST'])
def get_news_time_range():
    from_ = request.form['from']
    until_ = request.form['until']
    from_ = parser.parse(from_)
    until_ = parser.parse(until_)

    news_list = ss.get_news_time_range(from_, until_)
    
    return jsonify(news_list)
