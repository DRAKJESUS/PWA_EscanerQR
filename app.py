from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
from pymongo import MongoClient
import datetime

app = Flask(__name__)
app.secret_key = 'clave_secreta_segura'

client = MongoClient("mongodb://admin:admin@mongo:27017/?authSource=admin")
db = client["inventario"]
coleccion = db["productos"]
usuarios = db["usuarios"]

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        usuario = usuarios.find_one({"username": username, "password": password})
        if usuario:
            session['usuario'] = usuario['username']
            return redirect(url_for('index'))
        else:
            flash('Usuario o contraseña incorrectos')
            return redirect(url_for('login'))
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('usuario', None)
    return redirect(url_for('login'))

@app.route('/')
def index():
    if 'usuario' not in session:
        return redirect(url_for('login'))
    productos = list(coleccion.find({}, {"_id": 0}))
    return render_template("index.html", productos=productos)

@app.route('/api/registrar', methods=['POST'])
def registrar():
    data = request.get_json()
    try:
        qr_data = data.get('qr')
        if not qr_data:
            return jsonify({"status": "error", "message": "QR vacío"}), 400

        existente = coleccion.find_one({"ID": qr_data})
        if existente:
            return jsonify({"status": "repetido"})

        ahora = datetime.datetime.now()
        doc = {
            "ID": qr_data,
            "Fecha": ahora.strftime("%Y-%m-%d"),
            "Hora": ahora.strftime("%H:%M:%S"),
            "Nombre": "Producto desconocido"
        }
        coleccion.insert_one(doc)
        return jsonify({"status": "registrado"})

    except Exception as e:
        print("⚠️ Error en /api/registrar:", e)
        return jsonify({"status": "offline"})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)



