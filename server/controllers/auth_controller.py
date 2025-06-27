from flask_restful import Resource
from flask import request
from models import db, User
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash

class SignUp(Resource):
    def post(self):
        try:
            data = request.get_json()
            
            if not data or not all(key in data for key in ['username', 'email', 'password']):
                return {'error': 'Username, email and password are required'}, 400
                
            # Check existing users
            if User.query.filter_by(email=data['email']).first():
                return {'error': 'Email already exists'}, 409
            if User.query.filter_by(username=data['username']).first():
                return {'error': 'Username already exists'}, 409
                
            # Create user
            user = User(
                username=data['username'],
                email=data['email'],
            )
            user.set_password(data['password'])
            
            db.session.add(user)
            db.session.commit()
            
            # Create token for immediate login
            access_token = create_access_token(identity=user.id)
            
            return {
                'access_token': access_token,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email
                }
            }, 201
            
        except Exception as e:
            db.session.rollback()
            return {'error': str(e)}, 500
class Login(Resource):
    def post(self):
        data = request.get_json()
        
        # Input validation
        if not data.get('email') or not data.get('password'):
            return {'error': 'Email and password required'}, 400
        
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not check_password_hash(user.password_hash, data['password']):
            return {'error': 'Invalid credentials'}, 401
        
        # Create JWT token
        access_token = create_access_token(identity=user.id)
        
        return {
            'access_token': access_token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        }, 200