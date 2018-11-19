try:
    from scrapers.tatort_kommun import tatort, kommuner
    from scrapers.kommun_lan import kommun_lan, lan, lan_kommun
except ImportError:
    from tatort_kommun import tatort, kommuner
    from kommun_lan import kommun_lan, lan, lan_kommun

import json, requests, uuid

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

def search_text(text, region = None):
    # Look for tatort
    
    capital_words = [word for word in text.split() if word[0].isupper()]

    location = {}
    # look through county, muni, and then city
    #print (lan_kommun[region])
    
    for word in capital_words:
        for city in tatort:
            if word == city[0]:
                location['city'] = city[0]
                location['municipality'] = city[1]
                location['county'] = region
                location['conutry'] = "Sweden"
    
    if bool(location):
        print(text)
        print(capital_words, location)
        print("")
    

def reform_api_news(svt_news_list):

    cloud_news = []

    for svt_news in svt_news_list:
        news = {}
        #print(svt_news['image'])
        # Extract the wanted information
        if 'title'              in svt_news:
            news['title']       = svt_news['title']

        if 'lead'              in svt_news:
            news['lead']       = svt_news['lead']

        if 'text'              in svt_news:
            news['text']       = svt_news['text']

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

def get_lokal_api_news(region = "/nyheter/lokalt/stockholm/", amount = 50, page = 0): 
    global params
    params_struct = params + param_limit + str(amount) + param_page + str(page)   
    URL_REGION = api + region + params_struct
    r = requests.get(url = URL_REGION)
    
    region_news = r.json(encoding='utf-8')

    region_news = reform_api_news(region_news['auto']['content'])

    return region_news

def test():
    news = get_lokal_api_news()
    news = [json.loads(ele) for ele in news]
    print("")
    for ele in news:
        search_text(ele['title'], ele['location']['county'])
        if 'lead' in ele:
            search_text(ele['lead'], ele['location']['county'])
        if 'text' in ele:
            search_text(ele['text'], ele['location']['county'])

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

test()
