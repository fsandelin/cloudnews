from app import app


from scrapers.svt import svt_scraping

def post_news(json_news, URL):

    headers = {
    'Content-Type': "application/json",
    'cache-control': "no-cache"
    }

    if json_news[0] is not None:
        print(json_news[0])

    json_news = [json.loads(news) for news in json_news]
    
    r = requests.post(URL,  json = json_news[3], params = {"service": "tt" }, headers = headers)
    print(r.status_code, r.reason)

    print(r.text[:300] + '...')
    print(r.json)

def print_json(json_str):

    json_obj = json.loads(json_str)

    for elm in json_obj:
        print( elm[:6], "\t: \t",json_obj[elm][0:40])

    print ("")

def random_posts(news_list):
    headers = {
    'Content-Type': "application/json",
    'cache-control': "no-cache"
    }
    URL = "http://localhost:3000"
    news_index = 0
    max_index  = len(news_list)
    while True:

        news_index += random.randint(1,5)
        if news_index >= max_index:
            break
        r = requests.post(URL,  json = news_list[news_index], params = {"service": "tt" }, headers = headers)
        print ("News index:", news_index)
        sleep(0.5 + random.random())
        pass
    pass

def presenting_representing():
    # Choose which regions, connected to counties
    # get the latest two weeks
    # now - 2 weeks (14days)

    global used_regions
    
    #used_regions = [svt_regions[0],svt_regions[1]]

    until_ = datetime.now()
    from_  = until_ - timedelta(days = 5)

    # Collect all news in a list
    news_list = get_news_selected_regions(used_regions[:10], from_, until_)
    

    # Find the news

    news_list = [json.loads(ele) for ele in news_list if 'Nyheter från dagen' not in json.loads(ele)['title']]
    print("Amount of news:", len(news_list))
    news_list = [search_text(ele) for ele in news_list]
    amount = 0
    for ele in news_list:
        if 'city' in ele['location']:
            amount += 1
        # print (json.dumps(ele, indent=4, sort_keys=True, default=str))

    print("Amount of found cities:", amount)
    #for ele in news:
        #search_text(ele)

    news_list = [json.dumps(ele, indent=4, sort_keys=True, default=str) for ele in news_list]

    # collect region names from the news, or store in different lists
    
    news_dict_list = []
    region_names = set()
    for news in news_list:
        news_dict = json.loads(news)
        news_dict_list.append(news_dict)
        region_names.add(news_dict['location']['county'])


    print ("Total news:", len(news_list), "\tdatetime type:", type(json.loads(news_list[0])['datetime']))
    # order by time

    # generate post commands towards the middleware at random times
    news_sorted_date = sorted(news_dict_list, key=lambda x: parser.parse(x['datetime']))

    #for news in news_sorted_date:
    #    print ("{:30}{:15}{:.20}".format(news['datetime'], news['location']['county'], news['title']))

    random_posts(news_sorted_date)
    pass

def test_time_range():
    from_  = datetime(2017, 12, 30)
    until_ = datetime(2018, 1, 1)
    api_obj = get_news_time_range(from_, until_)


    post_news(api_obj, "http://localhost:3000")
    print ("First object: ", json.loads(api_obj[FIRST])['datetime'])

def get_api_obj():
    print(get_lokal_api_object())

def main():
    presenting_representing()

if __name__ == "__main__":
    main() 