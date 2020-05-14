from app import app, db
from flask import request, jsonify, Response, abort
from flask_login import current_user, login_user
from app.models import User, Activity
from datetime import datetime


@app.route('/')
@app.route('/index')
def index():
    user = {'username': 'LC'}
    return '''
<html>
    <head>
        <title>Home Page - Microblog</title>
    </head>
    <body>
        <h1>Hello, ''' + user['username'] + '''!</h1>
    </body>
</html>'''

@app.route('/activity/all/', methods=['GET'])
def allActivities():
    uid = request.args.get('uid')
    activities = Activity.query.all()
    userActivities = Activity.query.filter(Activity.participants.any(id=uid)).all()
    return jsonify(
        activities=[i.serialize for i in activities], 
        userActivities=[i.serialize for i in userActivities]
    )


@app.route('/activity/search', methods=['GET'])
def SearchActivity():
    keyWord = request.args.get('keyWord')
    search = "%{}%".format(keyWord)
    activities = Activity.query.filter(Activity.title.like(search) | Activity.description.like(search)).all()
    return jsonify(activities=[i.serialize for i in activities])
    # db.users.filter(or_(db.users.name=='Ryan', db.users.country=='England'))


@app.route('/activity/create', methods=['POST'])
def createActivity():
    data = request.get_json()
    ownerId = data['ownerId']
    title = data['title']
    time = data['time']
    location = data['location']
    description = data['description']
    time = datetime.strptime(time, '%Y-%m-%d')

    if not ownerId and not title and not time and not location and not description:
        abort(400)
    user = User.query.get(ownerId)
    if not user:
        abort(400)
    organizer = user.firstName + ' ' + user.lastName

    activity = Activity(
        title=title,
        location=location,
        time=time,
        description=description,
        ownerId=ownerId,
        organizer=organizer
    )
    activity.participants.append(user)

    db.session.add(activity)
    db.session.commit()

    return jsonify(activity=activity.serialize), 200


@app.route('/activity/edit', methods=['PATCH'])
def editActivity():
    data = request.get_json()
    id = data['id']
    title = data['title']
    time = data['time']
    location = data['location']
    description = data['description']
    time = datetime.strptime(time, '%Y-%m-%d')

    if not id and not title and not time and not location and not description:
        abort(400) # missing arguments
        
    activity = Activity.query.get(id)

    if not activity:
        abort(400) # no activity exists

    activity.title = title
    activity.time = time 
    activity.location = location
    activity.description= description

    db.session.add(activity)
    db.session.commit()

    return jsonify(activity=activity.serialize)


@app.route('/activity/delete', methods=['DELETE'])
def deleteActivity():
    data = request.get_json()
    id = data['id']

    activity = Activity.query.get(id)
    
    if not activity:
        abort(400)

    db.session.delete(activity)
    db.session.commit()

    return Response("", status=200)


@app.route('/user/sign_up', methods = ['POST'])
def userSignUp():
    data = request.get_json()
    username = data['username']
    firstName = data['firstName']
    lastName = data['lastName']
    password = data['password']

    if not username or not password or not firstName or not lastName:
        abort(400) # missing arguments
    if User.query.filter_by(username = username).first() is not None:
        abort(400) # existing user


    user = User(username = username, firstName=firstName, lastName=lastName)
    # user = User(username = username)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    token = user.generate_auth_token()
    return jsonify({ 
        'uid': user.id,
        'username': user.username, 
        'firstName': user.firstName,
        'lastName': user.lastName,
        'token': token.decode('ascii') 
    }), 201


@app.route('/user/log_in/', methods = ['GET'])
def userLogIn():
    # data = request.get_json()
    username = request.args.get('username')
    password = request.args.get('password')

    if (not username) or (not password):
        abort(400)

    if not User.query.filter_by(username=username).first():
        abort(400)
    
    user = User.query.filter_by(username=username).first()

    if not user.check_password(password):
        abort(400)
    
    token = user.generate_auth_token()
    return jsonify({ 
        'uid': user.id,
        'username': user.username, 
        'firstName': user.firstName,
        'lastName': user.lastName,
        'token': token.decode('ascii') 
    }), 201

@app.route('/activity/join', methods=['PATCH'])
def joinActivity():
    data = request.get_json()
    id = data['id']
    uid = data['ownerId']
    if not id and not uid :
        abort(400) # missing arguments
        
    activity = Activity.query.get(id)
    user = User.query.filter_by(id=uid).first()

    if not activity or not user:
        abort(400) # no activity exists

    participants = activity.participants
    if user in participants:
        return jsonify(activity=activity.serialize), 200 
    # idx = participants.index(name)
    # participants.pop(idx)
    activity.participants.append(user)

    db.session.add(activity)
    db.session.commit()

    return jsonify(activity=activity.serialize), 200


@app.route('/activity/quit', methods=['PATCH'])
def quitActivity():
    print(11111)
    data = request.get_json()
    id = data['id']
    uid = data['ownerId']
    if not id and not uid :
        abort(400) # missing arguments
        
    activity = Activity.query.get(id)
    user = User.query.filter_by(id=uid).first()

    if not activity or not user:
        abort(400) # no activity exists

    participants = activity.participants
    if user not in participants:
        abort(400)
    # idx = participants.index(name)
    # participants.pop(idx)
    idx = activity.participants.index(user)
    activity.participants.pop(idx)

    db.session.add(activity)
    db.session.commit()

    return jsonify(activity=activity.serialize), 200