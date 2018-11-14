import os, sys, requests, json, math

def post():
    r = requests.post("http://localhost:5000/getnewstimerange", data = { "from" : "2018-1-6", "until" : "2018-1-10"} )
    print(r.status_code, r.reason)
    return r.text
    #print(r.text[:300] + '...')
    #print(r.json)

def get():
    r = requests.get("http://localhost:5000/get")
    print(r.status_code, r.reason)
    
    #print(r.text[:300] + '...')
    #print(r.json)

def main():
    #get()
    json_list = post()
    json_list = json.loads(json_list)

    for elm in json_list:
        print(elm)
    
if __name__ == "__main__":
    main()