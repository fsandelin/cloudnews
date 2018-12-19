from scrapers.data.lan_kommun_tatort import lan, lan_kommun, kommun_tatort
from scrapers.data.constants import FIRST, LAST, EARLIER, LATER
from scrapers.data.svt_globals import svt_translate
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

    if isinstance(region, list):

        for region in region:
            for kommun in lan_kommun[region]:
                try:
                    for city in kommun_tatort[kommun]:
                        if city_in_text(city, capital_words): 
                            location['city'] = city
                            location['municipality'] = kommun
                            location['county'] = region
                            city_found = True
                            break
                        else:
                            location['county'] = region
                except KeyError:
                    pass

                if city_found:
                    break

    else:
        for kommun in lan_kommun[region]:
            try:
                for city in kommun_tatort[kommun]:
                    if city_in_text(city, capital_words):                    
                        location['city'] = city
                        location['municipality'] = kommun
                        location['county'] = region
                        city_found = True
                        break
                    else:
                        location['county'] = region
            except KeyError:
                pass

            if city_found:
                break

    location
    return (city_found, location)

def get_region(region_list, capital_words):
    for region in region_list:
        if city_in_text(region.split()[0], capital_words):
            return region

    return region_list

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

    if news['location']['county'] in svt_translate:
        region = svt_translate[news['location']['county']]
    else:
        region = news['location']['county']
    
    capital_words = [word for word in text.split() if word[0].isupper()]

    #if "Gotland" in capital_words:
    #    print("Gotland found")

    if isinstance(region, list):
        region = get_region(region, capital_words)


    city_found, location = find_location(region, capital_words)


    location['country'] = "Sweden"

    news['location'] = location

    return (city_found, news)
    
