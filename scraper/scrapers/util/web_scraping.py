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

lan = []
kommuner = []
kommun_lan = []
tatort = []

def get_wiki_table(url, filename, data_names, index):
    
    # Initiate the Beautiful soup
    content = urlopen(url).read()
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
    
    data = [ele[index[0]:index[1]] for ele in data[1:]]

    group_names = set()

    for ele in data:
        group_names.add(ele[1])

    
    f = open(filename, "w")

    f.write(data_names[1] + " = [")
    first = True
    for ele in group_names:
        if first:
            first = False
        else:
            f.write(",\n")
        f.write("\"" + ele + "\"")
    f.write("]\n")

    f.write(data_names[0] + " = [")
    first = True
    for ele in data:
        if first:
            first = False
        else:
            f.write(",\n")
        f.write(str(ele))
    f.write("]\n")

    f.close


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


def main():
    url2 = "https://sv.wikipedia.org/wiki/Lista_%C3%B6ver_Sveriges_t%C3%A4torter"
    url = "https://sv.wikipedia.org/wiki/Lista_%C3%B6ver_Sveriges_kommuner"
    apan = "http://kodapan.se/geodata/data/2015-06-26/platser.osm.xml"
    get_wiki_table(url, "kommun_lan.py", ["kommun_lan", "lan"], [1,3])

if __name__ == "__main__":
    main()
