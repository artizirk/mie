import datetime
from uuid import uuid4
from mongoengine import *

__all__ = ['Museum',
           'Museaal',
           'TicketType',
           'OpenTime',
           'ApiKey',
           'User',
           'Session']

def gen_sid():
    return uuid4().hex


class TicketType(EmbeddedDocument):

    description = StringField(required=True)
    price = DecimalField(required=True)
    currency = StringField(default="EUR")

class OpenTime(EmbeddedDocument):

    week_day = StringField(required=True)
    open_time = StringField(required=True)
    close_time = StringField(required=True)

class Museum(Document):
    """A Museum"""

    name = StringField(required=True)
    address = StringField()
    location = PointField()
    open_times = StringField()
    #open_times = EmbeddedDocumentListField(OpenTime)
    home_page = URLField()
    description = StringField()
    phone = ListField(StringField())
    email = EmailField()

    categories = ListField(StringField())

class Museaal(Document):

    name = StringField(required=True)
    description = StringField()
    museum = ReferenceField(Museum)


class ApiKey(Document):
    """Api keys for access"""

    app_name = StringField(required=True)
    key = StringField(required=True)

class User(Document):
    """A generic user who can login"""

    full_name = StringField()
    email = EmailField(required=True, unique=True)
    auth = StringField()

    registration_time = DateTimeField(default=datetime.datetime.now)

    admin = BooleanField(default=False)

class Session(Document):

    user = ReferenceField(User)
    sid = StringField(default=gen_sid, primary_key=True)
    ctime = DateTimeField(default=datetime.datetime.now)

