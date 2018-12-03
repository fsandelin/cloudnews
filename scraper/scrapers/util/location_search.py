from scrapers.data.lan_kommun_tatort import lan, lan_kommun, kommun_tatort
from scrapers.data.constants import FIRST, LAST, EARLIER, LATER

import json
import requests
import uuid
from difflib import SequenceMatcher

def similar(a, b):
    return SequenceMatcher(None, a, b).ratio()

def city_in_text(city, words):
    for word in words:
        if similar(word, city) > 0.8:
            return True
    return False

def get_kommun_name(kommun):
    kommun = kommun.split()[:-1]
    if kommun[0][-1] == 's':
        kommun = kommun[0][:-1]
    return kommun

def find_location(region, capital_words):


    location = {}
    # look through county, muni, and then city
    city_found = False

    if region == 'Sörmland':
        region = 'Södermanland'

    if region == 'Väst':
        region = 'Västra Götaland'

    if region == 'Öst':
        region = 'Östergötland'


    for kommun in lan_kommun[region]:
        try:
            for city in kommun_tatort[kommun]:
                if city_in_text(city, capital_words):                    
                    kommun_name = get_kommun_name(kommun)
                    location['city'] = city
                    location['municipality'] = kommun_name
                    #print("Kommun short name:", kommun_name, "Kommun full name:", kommun)
                    city_found = True
                    break
        except KeyError:
            pass

        if city_found:
            break

    return (city_found, location)

def search_cloud_news(news):

    city_found = False
    
    # Look for tatort    
    text = news['title'] + " "
    if 'lead' in news:
        text += news['lead'] + " "
    if 'body' in news:
        text += news['body']

    if 'location' not in news:
        print(news)
    region  = news['location']['county']

    capital_words = [word for word in text.split() if word[0].isupper()]

    city_found, location = find_location(region, capital_words)

    #print (local_tatort)
    #for word in capital_words:
    #    for city in local_tatort:
    #        if word == city[0]:
    #            location['city'] = city[0]
    #            location['municipality'] = city[1]
    #            location['conutry'] = "Sweden"
    
  
    location['county'] = region
    location['country'] = "Sweden"

    news['location'] = location

    #print(text)
    #print(capital_words, location)
    #print(news['url'])
    #print("")

    return (city_found, news)
    
