
URL_API = "https://api.svt.se/nss-api/page"
URL_SVT = "https://www.svt.se"

params = "?q=auto"
param_limit = ",limit="
param_page  = ",page="

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
"/nyheter/lokalt/ost/"
]

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
                svt_regions[17],
                svt_regions[18],
                svt_regions[19],
                svt_regions[20]
                ]
# find where svt_region[16] is "väst"

svt_lokala_namn = [
"Blekinge",
"Dalarna",
"Gävleborg",
"Halland",
"Helsingborg",
"Jämtland",
"Jönköping",
"Norrbotten",
"Skåne",
"Småland",
"Stockholm",
"Södertälje",
"Sörmland",
"Uppsala",
"Värmland",
"Väst",
"Västerbotten",
"Västernorrland",
"Västmanland",
"Örebro",
"Öst"
]

svt_translate = {
"Blekinge" : "Blekinge län",
"Dalarna" : "Dalarnas län",
"Gävleborg" : "Gävleborgs län",
"Halland" : "Hallands län",
"Helsingborg" : "Skåne län", # också som skåne
"Jämtland" : "Jämtlands län",
"Jönköping" : "Jönköpings län",
"Norrbotten" : "Norrbottens län",
"Skåne" : "Skåne län",
"Småland" : ["Kalmar län", "Kronobergs län"], # tilhör både "Kalmar län" "Kronobergs län"
"Stockholm" : "Stockholms län",
"Södertälje" : "Stockholms län", # också som stockholm
"Sörmland" : "Södermanlands län",
"Uppsala" : "Uppsala län",
"Värmland" : "Värmlands län",
"Väst" : "Västra Götalands län",
"Västerbotten" : "Västerbottens län",
"Västernorrland" : "Västernorrlands län",
"Västmanland" : "Västmanlands län",
"Örebro" : "Örebro län",
"Öst" : ["Östergötlands län", "Gotlands län"] # tillhör båda länen
}

