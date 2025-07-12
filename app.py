from flask import Flask, redirect, url_for, request, make_response
from routes.login import bp_login
from routes.home import bp_home

app = Flask(__name__)

# Registrar blueprint
app.register_blueprint(bp_login)
app.register_blueprint(bp_home)

# Redirecionar "/" para "/login"
@app.route("/")
def index():
    return redirect(url_for('login.login'))

@app.route("/set-token", methods=['POST'])
def set_token():
    data = request.get_json()
    token = data.get('token')

    print('DEBUG JSON:', data)  # 👈 Veja o que chegou!
    print('Debug:', token)
    if not token:
        return {'status': 'erro'}, 400

    # Criar resposta com status ok
    resp = make_response({'status': 'ok'})

    # Criar o cookie
    resp.set_cookie(
        'auth_token',     # Nome do cookie
        token,            # Valor
        httponly=True,    # Não pode ser acessado por JS → mais seguro
        samesite='Lax',   # Evita CSRF simples
        secure=False       # Use isso se estiver rodando em HTTPS
    )

    return resp

@app.route('/logout')
def logout():
    resp = make_response(redirect(url_for('login.login')))
    resp.set_cookie('auth_token', '', expires=0)
    return resp

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)