
from bs4 import BeautifulSoup
from flask import jsonify
import pytz, json
utc=pytz.UTC

from dateutil import parser
from datetime import datetime, date, time, timedelta

try:
    # For Python 3.0 and later
    from urllib.request import urlopen
except ImportError:
    # Fall back to Python 2's urllib2
    from urllib2 import urlopen


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

    img_url = None
    if pict is not None:
        img_url = pict.find(attrs={"class" : "pic__img pic__img--preloaded pic__img--wide "})['src']

    #img_url = "fin.jpg"
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

def get_tatort_municipality():
    


    # Initiate the Beautiful soup
    content = urlopen("https://sv.wikipedia.org/wiki/Lista_%C3%B6ver_Sveriges_t%C3%A4torter").read()
    soup = BeautifulSoup(content, features='lxml')

    data = []

    # Get the table with information
    table = soup.find('table', attrs={"class" : "sortable wikitable"})
    

    table_body = table.find('tbody')
    rows = table_body.find_all('tr')

    for row in rows:
        cols = row.find_all('td')
        cols = [ele.text.strip() for ele in cols]
        data.append([ele for ele in cols if ele]) 
    
    data = [ele[:2] for ele in data[1:]]
    print(data[1])

    f = open("sveriges_tatort.py", "w")
    f.write("sveriges_tatort = [")
    for ele in data:
        f.write(str(ele) + ",")
    f.write("]")
    f.close
    #print(table)
    #city_muni = table.findAll("tr")
    #print(city_muni[1])
    #for elm in city_muni:
        
    #    print (elm.findAll("td"))

get_tatort_municipality()
