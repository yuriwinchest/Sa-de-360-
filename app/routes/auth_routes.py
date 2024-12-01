from flask import Blueprint, render_template

auth_routes = Blueprint('auth_routes', __name__)

@auth_routes.route('/')
def login():
    return render_template('pages/login.html')

@auth_routes.route('/profile')
def profile():
    return render_template('pages/profile.html')
