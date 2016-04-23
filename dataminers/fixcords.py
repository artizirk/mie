from pprint import pprint
from pymongo import MongoClient


client = MongoClient()
db = client.mie
museums = db.museum

for i, museum in enumerate(museums.find({ "location": { "$geoWithin": { "$centerSphere": [[ 59.4368751, 24.7452184 ], 0.1/6378.1 ] } } })):
    pprint(museum)
    print(i)
exit()

i = 0


for museum in museums.find():
    if "location" not in museum:
        continue
    pprint(museum["location"]["coordinates"])
    i += 1

    c = museum["location"]["coordinates"]
    museum["location"]["coordinates"] = [c[1], c[0]]
    museums.update_one({"_id":museum["_id"]}, {"$set":{"location.coordinates":museum["location"]["coordinates"]}})
    continue
    
    if type(museum["location"]["coordinates"]) == dict:
        print("dict")
    if type(museum["location"]["coordinates"]) == list:
        print("list")
    continue
    
    loc = {"type":"Point", "coordinates": museum["location"]}
    
    print(".", end="", flush=True)
    
print(i)
