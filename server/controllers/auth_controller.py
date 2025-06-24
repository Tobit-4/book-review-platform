from flask_restful import Resource
from flask import request
from models import db, User
from flask_jwt_extended import create_access_token

class SignUp(Resource):
    def post(self):
        data = request.get_data()

        if User.query.filter_by(email=data['email']).first():
            return {'error': 'Email already exists'}, 400
        
        user = User(
            username = data['username'],
            email = data['email'],
            password = data['password']
        )

        db.session.add(user)
        db.session.commit()

        return {"message": "User created succesfully"}, 200
class Login(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(email=data['email']).first()
            
        if not user or user.password != data['password']:
            return {'error': 'Invalid credentials'}, 401
                
        access_token = create_access_token(identity=user.id)
        return {'access_token': access_token}, 200