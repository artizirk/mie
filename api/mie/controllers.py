
from falcon import HTTPInternalServerError, HTTP_201
from .models import *
from .tools import TODOException

class MuseumResource():

    def on_get(self, req, resp, museum=None):
        if museum:
            resp.json = Museum.objects.get(id=museum).to_mongo()
            return
        museums = []
        for museum in Museum.objects:
            museums.append(museum.to_mongo())

        resp.json = museums
            

    def on_post(self, req, resp, museum=None):
        museum = Museum.from_json(req.stream.read().decode())
        museum.save()
        resp.status = HTTP_201

