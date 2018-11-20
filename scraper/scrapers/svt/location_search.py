try:
    from scrapers.lan_kommun_tatort import lan, lan_kommun, kommun_tatort
    from scrapers.svt.svt_web_scraping import get_news
except ImportError:
    from lan_kommun_tatort import lan, lan_kommun, kommun_tatort
    from svt_web_scraping import get_news

import json, requests, uuid
from difflib import SequenceMatcher

api = "https://api.svt.se/nss-api/page"
URL_SVT = "https://www.svt.se"

params = "?q=auto"
param_limit = ",limit="
param_page  = ",page="

EARLIER = True
LATER = False
FIRST = 0
LAST = -1

#from svt_scraping import *

def similar(a, b):
    return SequenceMatcher(None, a, b).ratio()

def city_in_text(city, words):
    for word in words:
        if similar(word, city) > 0.8:
            return True
    return False

def find_location(region, capital_words):
    location = {}
    # look through county, muni, and then city
    #print (lan_kommun[region])
    #local_tatort = [city for city in tatort if city[1] in lan_kommun[region]]

    city_found = False

    if region == 'Sörmland':
        region = 'Södermanland'
        
    for kommun in lan_kommun[region]:
        try:
            for city in kommun_tatort[kommun]:
                if city_in_text(city, capital_words):
                    location['city'] = city
                    kommun = kommun.split()[:-1]
                    if kommun[0][-1] == 's':
                        kommun[0] = kommun[0][:-1]
                    location['municipality'] = kommun[0]
                    #print(kommun)

                    city_found = True
                    break
        except KeyError:
            pass

        if city_found:
            break

    return location

def search_text(news):
    # Look for tatort
    
    text = news['title'] + " "
    if 'lead' in news:
        text += news['lead'] + " "
    if 'body' in news:
        text += news['body']

    region  = news['location']['county']

    capital_words = [word for word in text.split() if word[0].isupper()]

    location = find_location(region, capital_words)

    #print (local_tatort)
    #for word in capital_words:
    #    for city in local_tatort:
    #        if word == city[0]:
    #            location['city'] = city[0]
    #            location['municipality'] = city[1]
    #            location['conutry'] = "Sweden"
    
    if not bool(location):
        web_news = get_news(news['url'], region)
        if 'body' in json.loads(web_news):
            text = json.loads(web_news)['body']
            location = find_location(region, [word for word in text.split() if word[0].isupper()])

    location['county'] = region
    location['country'] = "Sweden"

    news['location'] = location

    #print(text)
    #print(capital_words, location)
    #print(news['url'])
    #print("")

    return news
    

def reform_api_news(svt_news_list):

    cloud_news = []

    for svt_news in svt_news_list:
        news = {}
        #print(svt_news['image'])
        # Extract the wanted information
        if 'title'              in svt_news:
            news['title']       = svt_news['title']

        if 'vignette'              in svt_news:
            news['lead']       = svt_news['vignette']

        if 'text'              in svt_news:
            news['body']       = svt_news['text']

        if 'published'          in svt_news:
            news['datetime']    = svt_news['published']

        if 'sectionDisplayName' in svt_news:
            news['location']    = { "county" : svt_news['sectionDisplayName'] }

        if 'teaserURL'          in svt_news:
            news['url']         = svt_news['teaserURL']

        if 'image'              in svt_news:
            news['imgurl']      = svt_news['image']['url']

        news['id'] = str(uuid.uuid4())
        news['source']  = 'svt'
        json_news = json.dumps(news, indent=4, sort_keys=True, default=str)
        cloud_news.append(json_news)

    return cloud_news

def get_lokal_api_news(region = "/nyheter/lokalt/dalarna/", amount = 50, page = 1): 
    global params
    params_struct = params + param_limit + str(amount) + param_page + str(page)   
    URL_REGION = api + region + params_struct
    r = requests.get(url = URL_REGION)
    
    region_news = r.json(encoding='utf-8')

    region_news = reform_api_news(region_news['auto']['content'])

    return region_news

def test():
    news = get_lokal_api_news()
    news = [json.loads(ele) for ele in news if 'Nyheter från dagen' not in json.loads(ele)['title']]
    print("Amount of news:", len(news))
    news = [search_text(ele) for ele in news]
    amount = 0
    for ele in news:
        if 'city' in ele['location']:
            amount += 1
        #print (json.dumps(ele, indent=4, sort_keys=True, default=str))

    print("Amount of found cities:", amount)
    #for ele in news:
        #search_text(ele)

#test()

