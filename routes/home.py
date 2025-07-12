from flask import Blueprint, request, redirect, url_for, render_template

bp_home = Blueprint('home', __name__, template_folder='../templates')

@bp_home.route('/home')
def home():
    auth_token = request.cookies.get('auth_token')

    if not auth_token:
        return redirect(url_for('login.login'))  # Se não tem token, volta pro login

    # Aqui você poderia validar esse token com seu backend externo também,
    # pra garantir que não é falso.

    return render_template('home.html')
