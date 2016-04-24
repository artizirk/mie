


from falcon import HTTPInternalServerError, HTTP_201
from .models import *
from .tools import TODOException

class MuseumResource():

    def on_get(self, req, resp, museum=None):
        #for m in Museum.objects:
        #    m.save()
        if museum:
            resp.json = Museum.objects.get(id=museum).to_mongo()
            return
        museums = []

        q = req.get_param("q")
        start = req.get_param_as_int("start")
        end = req.get_param_as_int("end")
    
        try:
            lat = float(req.get_param("lat"))
        except TypeError:
            lat = None
        try:
            lon = float(req.get_param("lon"))
        except TypeError:
            lon = None
        try:
            ran = float(req.get_param("ran"))
        except TypeError:
            ran = None

        f = {}
        if q:
            print("search for q:", q)
            f = {"$or":[{"name":{"$regex":q, "$options":"ix"}},
                         {"description":{"$regex":q, "$options":"ix"}},
                         {"address":{"$regex":q, "$options":"ix"}},
                         {"categories":{"$regex":q, "$options":"ix"}}]}
            results = Museum.objects(__raw__=f)
        
        if lat and lon and ran:
            print("location query, lat", lat, " lon:", lon, " ran:", ran)
            
            locf = { "location": { "$geoWithin": { "$centerSphere": [[ lat, lon ], ran/6378.1 ] } } }
            if f:
                f = {"$and": [locf, f]}
            else:
                f = locf
            #f = { "location": { "$geoWithin": { "$centerSphere": [[ 59.4368751, 24.7452184 ], 0.1/6378.1 ] } } }
            #results = Museum.objects(location__near=[58.4374942, 24.7913723], location__max_distance=1)
            #results = Museum.objects(location__geo_within_sphere=[(59.4368751, 24.7452184), 0.1/6378.1])

        if f:
            results = Museum.objects(__raw__=f)
        else:
            results = Museum.objects

        results_len = len(results)
        if start:
            results = results[start:]
        if end:
            results = results[:end]
        elif start:
            end = start + 10
            results = results[:end]            

        selection_len = len(results)
        print("selection_len", selection_len)
        for museum in results:
            museums.append(museum.to_mongo())
        
        resp.json = museums
            

    def on_post(self, req, resp, museum=None):
        json = req.stream.read().decode()
        museum = Museum.from_json(json)
        museum.save()
        resp.status = HTTP_201

