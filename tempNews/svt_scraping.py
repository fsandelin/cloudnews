#!/usr/bin/python
# -*- coding: iso-8859-15 -*-
import os, sys, requests, json

from dateutil import parser
from datetime import datetime

import urllib2
from bs4 import BeautifulSoup


from svt_lokale import lokal_names, svt_lokale

URL_SVT = "https://www.svt.se/nyheter/lokalt/orebro/liga-misstanks-ligga-bakom-ny-stold-fran-verktygsbil"
URL_SVT2 = "https://www.svt.se/nyheter/lokalt/orebro/kraftig-okning-av-stolder-ur-hantverksbilar"
r = requests.get(url = URL_SVT)
data = r.text
data = data.splitlines()

content = urllib2.urlopen(URL_SVT2).read()

soup = BeautifulSoup(content, features='lxml')

#print soup.prettify()

#print soup.title

#for link in soup.find_all('a'):
#   print(link.get('href'))

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

#print pict
print "\n",pict.find(attrs={"class" : "pic__img pic__img--preloaded pic__img--wide "})['src']

dt = parser.parse(date)


news = {}
news['title'] = head.text
news['lead']  = lead.text
news['body']  = body.text
news['time']  = dt
news['url']   = URL_SVT
json_data = json.dumps(news, indent=4, sort_keys=True, default=str)

print "\n\n",json_data
