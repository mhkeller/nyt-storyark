import json
import requests

url = "http://api.nytimes.com/svc/search/v1/article?format=json&query=Damascus+%28Syria%29&fields=date%2C+word_count%2C+title%2C+url&rank=oldest&api-key=hackday2012api"
r = requests.get(url)
raw_data = r.json

n_pages = raw_data['total'] / 10
offsets = range(1, n_pages)
data = raw_data['results']

for offset in offsets:
    the_url = url + '&offset=' + str(offset)
    r = requests.get(the_url)
    the_data = r.json 
    data.extend(the_data['results'])
    print "downloading:", the_url
    
with open('data.json', 'wb') as fp:
    json.dump(data, fp)


