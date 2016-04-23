import json

import falcon
import mongoengine

class AboutResource():

    def on_get(self, req, resp):
        r = {"about": {
                "name": "Museums in Estonia API",
                "version": "1",
                "docs": "TODO"
                }
            }
        r.update({"endpoints":[
                        {"url":"/",
                        "description":"About this API"}
                    ]})

        resp.body = json.dumps(r, indent=4)



mongoengine.connect('mie', connect=False)

app = application = falcon.API()
app.add_route("/", AboutResource())
