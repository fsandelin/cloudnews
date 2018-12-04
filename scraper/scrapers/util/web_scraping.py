from bs4 import BeautifulSoup
from flask import jsonify
import pytz, json
utc=pytz.UTC

import time
from dateutil import parser
from datetime import datetime, date, timedelta

try:
    # For Python 3.0 and later
    from urllib.request import urlopen
except ImportError:
    # Fall back to Python 2's urllib2
    from urllib2 import urlopen

import asyncio
import concurrent.futures

lan = []
kommuner = []
kommun_lan = []
tatort = []

wiki = "https://sv.wikipedia.org"


def get_city(city):
    city_content = urlopen(wiki + city['url']).read()
    city_soup = BeautifulSoup(city_content, features='lxml')
    if city_soup is not None:
        city_geo = city_soup.find(attrs={"class" : "geo-dms"})
        if city_geo is not None:
            city_long = city_geo.find(attrs={"class" : "longitude"})
            city_lat = city_geo.find(attrs={"class" : "latitude"})
            if city_long is not None:
                city['longitude'] = city_long.text
            if city_lat is not None:
                city['latitude'] = city_lat.text

    return city
    

async def get_cities(cities):

    with concurrent.futures.ThreadPoolExecutor(max_workers=200) as executor:

        loop = asyncio.get_event_loop()
        futures = [
            loop.run_in_executor(
                executor, 
                get_city,
                city
            )
            for city in cities
        ]

        for city in await asyncio.gather(*futures):
            print(city)
            pass



def run_threads(data):
    loop = asyncio.get_event_loop()
    loop.run_until_complete(get_cities(data))


def get_wiki_table(url, filename, data_names, index):
    
    # Initiate the Beautiful soup
    content = urlopen(url).read()
    soup = BeautifulSoup(content, features='lxml')

    data = []

    # Get the table with information
    table = soup.find('table', attrs={"class" : "sortable wikitable"})
    

    table_body = table.find('tbody')
    #scripts = table_body.find('span')


    rows = table_body.find_all('tr')

    i = 0
    for row in rows:
        cols = row.find_all('td')
        if len(cols) is 0:
            continue
        for col in cols:
            s = col.find('span')
            if s is not None:
                s.extract()
        if len(cols) is not 0:
            url = cols[0].find('a')['href']

        cols = [ele.text.strip() for ele in cols]
        city = {}
        city['key'] = "city-" + cols[0] + "-" + cols[1]
        city['name'] = cols[0]
        city['municipality'] = cols[1]
        city['population'] = cols[2]
        city['url'] = url
        data.append(city)
    
    start_time = time.time()
    run_threads(data[:100])
    print(data[1])
    print("--- %s seconds ---" % (time.time() - start_time))

    f = open(filename, "w")

    f.write(json.dumps(data))


def add_mun_lan():
    f = open("kommun_lan.py", 'a')
    f.write("lan_kommun = {")
    for l in lan:
        f.write("\"" + l + "\":" + "[")
        first = True
        for kommun in kommun_lan:
            if kommun[1] in l:
                if first:
                    first = False
                else:
                    f.write(",")
                f.write("\"" + kommun[0] + "\"")
        f.write("],\n")
    f.write("}")

def add_city_mun():
    f = open("tarta.py", 'a')
    f.write("kommun_tatort = {")
    for k in kommuner:
        f.write("\"" + k + "\":" + "[")
        first = True
        for city in tatort:
            if city[1] in k:
                if first:
                    first = False
                else:
                    f.write(",")
                f.write("\"" + city[0] + "\"")
        f.write("],\n")
    f.write("}")

def get_json():
    f = open("tatort_info.json", "r")
    json_obj = json.loads(f.read())
    print(json_obj[1000])

def main():
    url2 = "https://sv.wikipedia.org/wiki/Lista_%C3%B6ver_Sveriges_t%C3%A4torter"
    url = "https://sv.wikipedia.org/wiki/Lista_%C3%B6ver_Sveriges_kommuner"
    apan = "http://kodapan.se/geodata/data/2015-06-26/platser.osm.xml"
    get_wiki_table(url2, "test.py", ["tatort", "lan"], [0,2])

if __name__ == "__main__":
    main()
