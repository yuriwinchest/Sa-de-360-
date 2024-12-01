from flask import Flask, render_template
from flask_cors import CORS

from flask import Flask, render_template, url_for
from flask_cors import CORS

app = Flask(__name__, 
    template_folder='../frontend/templates',
    static_folder='../frontend/static',
    static_url_path='/static')

@app.route('/')
def index():
    return render_template('pages/login.html')

@app.route('/perfil')
def profile():
    # Simulando dados do usuário para o protótipo
    user_data = {
        'name': 'Maria Raimunda',
        'cns': '123.4567.8901.2345',
        'photo_url': '/static/assets/images/profile.jpg'
    }
    return render_template('pages/profile.html', user=user_data)

@app.route('/dashboard')
def dashboard():
    return render_template('pages/dashboard.html')

@app.route('/agendamentos')
def appointments():
    return render_template('pages/appointments.html')

@app.route('/saude')
def health():
    return render_template('pages/health.html')

@app.route('/familia')
def family():
    return render_template('pages/family.html')

@app.route('/configuracoes')
def settings():
    return render_template('pages/settings.html')

@app.route('/ajuda')
def help():
    return render_template('pages/help.html')

@app.route('/logout')
def logout():
    # Implementar lógica de logout aqui
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)