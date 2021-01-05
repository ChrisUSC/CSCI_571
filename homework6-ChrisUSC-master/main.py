# [START gae_python37_app]
from newsapi.newsapi_client import NewsApiClient
from flask import Flask, request, jsonify, make_response
import json
import collections
from itertools import islice
import sys

# If `entrypoint` is not defined in app.yaml, App Engine will look for an app
# called `app` in `main.py`.
app = Flask(__name__, static_url_path="")
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

def take(n, iterable):
    return list(islice(iterable, n))

@app.route("/index.html")
@app.route("/")
def index():
    return app.send_static_file("index.html");

@app.route('/load', methods=['GET'])
def load():
    stopWords = []
    with open("stopwords_en.txt", 'r') as f:
        for line in f:
            stopWords.append(line.rstrip())

    newsapi = NewsApiClient(api_key='3061013219ce4282b5d26bdcf8b9f966')
    topHeadlines = newsapi.get_top_headlines(q='', sources='', page_size=30)
    counts = dict()
    count = 0
    for headline in topHeadlines['articles']:
        title = headline["title"]
        words = title.split()
        for word in words:
            word = word.lower()
            if word not in stopWords:
                if word in counts:
                    counts[word] += 1
                else:
                    counts[word] = 1
    #WORD BANK
    sorted_counts = sorted(counts.items(), key = lambda kv:(kv[1], kv[0]))
    sorted_counts.reverse()
    sortedDict = collections.OrderedDict(sorted_counts)
    wordCloud = take(30, sortedDict.items())
    #Scrolling headline
    generalCount = 0
    generalData = []
    for i in topHeadlines['articles']:
        if(generalCount != 5 and i["urlToImage"] and i["author"] and i["description"] and i["url"] and i["urlToImage"]):
            generalData.append(i["urlToImage"])
            generalData.append(i["title"])
            generalData.append(i["description"])
            generalData.append(i["url"])
            generalCount = generalCount + 1

    #CNN
    cnnHeadlines = newsapi.get_top_headlines(q='', sources='cnn', page_size=30)

    cnnCount = 0
    cnnData = []
    for i in cnnHeadlines['articles']:
        if(cnnCount != 4 and i["urlToImage"] and i["author"] and i["description"] and i["url"] and i["urlToImage"]):
            cnnData.append(i["urlToImage"])
            cnnData.append(i["title"])
            cnnData.append(i["description"])
            cnnData.append(i["url"])
            cnnCount = cnnCount + 1
    #FOX
    foxHeadlines = newsapi.get_top_headlines(q='', sources='fox-news', page_size=30)

    foxCount = 0
    foxData = []
    for i in foxHeadlines['articles']:
        if(foxCount != 4 and i["urlToImage"] and i["author"] and i["description"] and i["url"] and i["urlToImage"]):
            foxData.append(i["urlToImage"])
            foxData.append(i["title"])
            foxData.append(i["description"])
            foxData.append(i["url"])
            foxCount = foxCount + 1

    return jsonify({"generalData": generalData, "wordCloud": wordCloud,  "cnnData": cnnData, "foxData": foxData})

@app.route('/search', methods=['GET'])
def search():
    k = request.args.get('k', '')
    f = request.args.get('f', '')
    t = request.args.get('t', '')
    c = request.args.get('c', '')
    s = request.args.get('s', '')
    print(k);
    print(f);
    print(t);
    print(c);
    print(s);
    if s == "all":
        s = ""


    newsapi = NewsApiClient(api_key='3061013219ce4282b5d26bdcf8b9f966')
    pageSize = 30;
    results = newsapi.get_everything(q=k, sources=s, from_param=f, to=t, language='en', page_size=pageSize, sort_by='publishedAt')

    searchCount = 0
    searchData = []
    for i in results['articles']:
        if(searchCount != 15 and i["publishedAt"] and i["urlToImage"] and i["author"] and i["description"] and i["url"] and i["urlToImage"]):
            temp = i["source"]
            searchData.append(i["urlToImage"])
            searchData.append(i["title"])
            searchData.append(i["description"])
            searchData.append(i["author"])
            searchData.append(temp["name"])
            searchData.append(i["publishedAt"])
            searchData.append(i["url"])
            searchCount = searchCount + 1

    return jsonify({"results": searchData})

@app.route('/all', methods=['GET'])
def all():
    newsapi = NewsApiClient(api_key='3061013219ce4282b5d26bdcf8b9f966')
    sources = newsapi.get_sources(language='en', country='us')
    return jsonify({"category": sources});

@app.route('/Business', methods=['GET'])
def Business():
    newsapi = NewsApiClient(api_key='3061013219ce4282b5d26bdcf8b9f966')
    sources = newsapi.get_sources(category='business', language='en', country='us')
    return jsonify({"category": sources});

@app.route('/Entertainment', methods=['GET'])
def Entertainment():
    newsapi = NewsApiClient(api_key='3061013219ce4282b5d26bdcf8b9f966')
    sources = newsapi.get_sources(category='entertainment', language='en', country='us')
    return jsonify({"category": sources});

@app.route('/General', methods=['GET'])
def General():
    newsapi = NewsApiClient(api_key='3061013219ce4282b5d26bdcf8b9f966')
    sources = newsapi.get_sources(category='general', language='en', country='us')
    return jsonify({"category": sources});

@app.route('/Health', methods=['GET'])
def Health():
    newsapi = NewsApiClient(api_key='3061013219ce4282b5d26bdcf8b9f966')
    sources = newsapi.get_sources(category='health', language='en', country='us')
    return jsonify({"category": sources});

@app.route('/Science', methods=['GET'])
def Science():
    newsapi = NewsApiClient(api_key='3061013219ce4282b5d26bdcf8b9f966')
    sources = newsapi.get_sources(category='science', language='en', country='us')
    return jsonify({"category": sources});

@app.route('/Sports', methods=['GET'])
def Sports():
    newsapi = NewsApiClient(api_key='3061013219ce4282b5d26bdcf8b9f966')
    sources = newsapi.get_sources(category='sports', language='en', country='us')
    return jsonify({"category": sources});

@app.route('/Technology', methods=['GET'])
def Technology():
    newsapi = NewsApiClient(api_key='3061013219ce4282b5d26bdcf8b9f966')
    sources = newsapi.get_sources(category='technology', language='en', country='us')
    return jsonify({"category": sources});

if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.
    app.run(host='0.0.0.0', port=8080, debug=True)
# [END gae_python37_app]
