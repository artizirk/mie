from pprint import pprint
from pymongo import MongoClient
import requests

client = MongoClient()
db = client.mie
museums = db.museum

mus = {}

for museum in museums.find():
    if museum["name"] in mus:
        continue
    dups = list(museums.find({"name":museum["name"]}))
    m = {}
    for dupm in dups:
        m.update(dupm)

    for key, val in m.items():
        if type(val) == list:
            v = []
            for i in val:
                v.append(i.encode().replace(b"\xc2\xa0", b" ").replace(b"\n", b" ").strip().decode())
            m[key] = v
        elif type(val) == str:
            m[key] = val.encode().replace(b"\xc2\xa0", b" ").replace(b"\n", b" ").strip().decode()
    

    if "location" not in m and "address" in m or "aadress" in m:
        try:
            m["address"] = m["aadress"]
            del m["aadress"]
        except:
            pass
        r = requests.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + m["address"])
        for result in r.json().get("results"):
            location = result.get("geometry").get("location")
            address = result.get("formatted_address")
            m["address"] = address
            m["location"] = [location.get("lat"), location.get("lng")]


    mus[museum["name"]] = museum["_id"]
    del m["_id"]
    museums.replace_one({"_id": museum["_id"]}, m)

    museums.remove({"_id":{"$in":[mid["_id"] for mid in dups if mid["_id"] != museum["_id"]]}})
    pprint(m)
print(len(mus))
