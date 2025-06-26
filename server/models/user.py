from sqlalchemy_serializer import SerializerMixin
from config import db
from werkzeug.security import generate_password_hash, check_password_hash

follows = db.Table(
    'follows',
    db.Column('follower_id', db.Integer, db.ForeignKey('users.id')),
    db.Column('followed_id', db.Integer, db.ForeignKey('users.id'))
)

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False, unique=True) 
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)  
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    
    # Relationships
    reviews = db.relationship('Review', back_populates='user', cascade='all, delete-orphan')

    following = db.relationship(
        'User',
        secondary=follows,
        primaryjoin=(follows.c.follower_id == id),
        secondaryjoin=(follows.c.followed_id == id),
        backref='followers'
    )

    serialize_rules = (
        '-password_hash',
        '-reviews.user',
        '-following',
        '-followers'
    )

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    serialize_rules = ('-password_hash',)