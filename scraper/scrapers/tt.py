#!/usr/bin/python
# -*- coding: iso-8859-15 -*-
import os, sys

# importing the requests library 
import requests 
from bs4 import BeautifulSoup
# api-endpoint 
URL = "http://maps.googleapis.com/maps/api/geocode/json"
URL = "https://via.tt.se/json/v2/releases"


URL_kommun = "https://catalog.skl.se/rowstore/dataset/491a181b-4b6d-422e-997c-0fb2fc6bd8bc"

# location given here 
location = "delhi technological university"

# defining a params dict for the parameters to be sent to the API 
PARAMS = {'address':location} 
PARAMS = {'search' : 'bil', 'size' : '10'}
# sending get request and saving the response as response object 
r = requests.get(url = URL, params = PARAMS) 

# extracting data in json format 
data = r.json() 

data = data['releases']

find_text = '<ul class="nyh_regional-selector-box__list">'
find_text2 =  '<li class="nyh_regional-selector-box__list-item">'

URL_SVT = 'https://www.svt.se/nyheter/lokalt/uppsala/'


r = requests.get(url = URL_SVT)

for elm in data[0]:
    print (elm)
