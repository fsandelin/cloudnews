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


used_regions = [svt_regions[0], 
                svt_regions[1],
                svt_regions[2],
                svt_regions[3],
                svt_regions[5],
                svt_regions[6],
                svt_regions[7],
                svt_regions[8],
                svt_regions[10],
                svt_regions[12],
                svt_regions[13],
                svt_regions[14],
                svt_regions[15],
                svt_regions[16],
                svt_regions[17],
                svt_regions[18],
                svt_regions[19],
                svt_regions[20]]


lokal_names = map(methodcaller("split", '/'), svt_regions)

temp_names = []

for url in lokal_names:
    temp_names.append(url[3])

lokal_names = temp_names
