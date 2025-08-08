import os
from flask import Blueprint, request, redirect, url_for, render_template

# Caminho absoluto para a pasta de templates
TEMPLATE_DIR = os.path.join(os.path.dirname(__file__), '../templates')

bp_home = Blueprint('home', __name__, template_folder=TEMPLATE_DIR)

@bp_home.route('/home', methods=['GET'])
def home():
    auth_token = request.cookies.get('auth_token')

    if not auth_token:
        # Sem token, redireciona para o login
        return redirect(url_for('login.login'))

    # Aqui você poderia validar esse token no backend externo
    # if not validar_token(auth_token):
    #     return redirect(url_for('login.login'))

    return render_template('home.html')
