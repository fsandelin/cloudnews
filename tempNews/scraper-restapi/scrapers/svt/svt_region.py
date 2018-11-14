from operator import methodcaller

svt_regions = [
"/nyheter/lokalt/blekinge/",
"/nyheter/lokalt/dalarna/",
"/nyheter/lokalt/gavleborg/",
"/nyheter/lokalt/halland/",
"/nyheter/lokalt/helsingborg/",
"/nyheter/lokalt/jamtland/",
"/nyheter/lokalt/jonkoping/",
"/nyheter/lokalt/norrbotten/",
"/nyheter/lokalt/skane/",
"/nyheter/lokalt/smaland/",
"/nyheter/lokalt/stockholm/",
"/nyheter/lokalt/sodertalje/", 
"/nyheter/lokalt/sormland/",
"/nyheter/lokalt/uppsala/",
"/nyheter/lokalt/varmland/",
"/nyheter/lokalt/vast/",
"/nyheter/lokalt/vasterbotten/",
"/nyheter/lokalt/vasternorrland/",
"/nyheter/lokalt/vastmanland/", 
"/nyheter/lokalt/orebro/", 
"/nyheter/lokalt/ost/"]

lokal_names = map(methodcaller("split", '/'), svt_regions)
#lokal_names = map()

#print (lokal_names)
temp_names = []

for url in lokal_names:
    temp_names.append(url[3])

lokal_names = temp_names

time_stamp = '<span class="Timestamp__timestamp___3RAf-" title="5 november 2018 13.42"><span>Publicerad</span> <time datetime="2018-11-05T12:42:42.000Z">idag 13.42</time></span>'