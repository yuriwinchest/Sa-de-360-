from flask import Flask

def create_app():
    app = Flask(__name__, template_folder='../frontend/templates', static_folder='../frontend/static')

    with app.app_context():
        from .routes import auth_routes
        app.register_blueprint(auth_routes, url_prefix='/auth')

    return app
