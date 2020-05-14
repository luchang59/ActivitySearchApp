from app import app, db, login
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import (TimedJSONWebSignatureSerializer
                          as Serializer, BadSignature, SignatureExpired)
from flask_login import UserMixin


users = db.Table('users',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('activity_id', db.Integer, db.ForeignKey('activity.id'), primary_key=True)
)


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    firstName = db.Column(db.String(120), nullable=False)
    lastName = db.Column(db.String(120), nullable=False)
    password_hash = db.Column(db.String(128))

    def __repr__(self):
        return '<User {}>'.format(self.username)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def generate_auth_token(self, expiration = 600):
        s = Serializer(app.config['SECRET_KEY'], expires_in = expiration)
        return s.dumps({ 'id': self.id })

    @staticmethod
    def verify_auth_token(token):
        s = Serializer(app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except SignatureExpired:
            return None # valid token, but expired
        except BadSignature:
            return None # invalid token
        user = User.query.get(data['id'])
        return user

    @property
    def serialize(self):
      return {
          'id': self.id,
          'username':self.username,
          'firstName': self.firstName,
          'lastName': self.lastName,
       }

class Activity(db.Model):
    __searchable__ = ['title', 'location', 'description']

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(140), index=True, nullable=False)
    location = db.Column(db.String(100), nullable=False)
    time = db.Column(db.DateTime, index=True)
    description = db.Column(db.Text)
    ownerId = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    organizer =  db.Column(db.String(120), nullable=False)
    participants = db.relationship('User', secondary = users, lazy=False, 
        backref=db.backref('activities', lazy=True))

    def __repr__(self):
        return '<Activity {}>'.format(self.title)
    
    @property
    def serialize(self):
       return {
          'id': self.id,
          'title':self.title,
          'location': self.location,
          'time': self.serialize_datetime,
          'description': self.description,
          'ownerId': self.ownerId,
          'organizer': self.organizer,
          'participants': self.serialize_many2many
       }

    @property
    def serialize_many2many(self):
      return [ item.serialize['firstName'] + " " + item.serialize['lastName'] for item in self.participants]

    @property
    def serialize_datetime(self):
      time = self.time
      time = time.strftime("%Y-%m-%d")
      return time
# flask_whooshalchemy.whoosh_index(app, Activity)


@login.user_loader
def load_user(id):
    return User.query.get(int(id))