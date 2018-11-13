from flask import render_template
from app import app

@app.route('/')
@app.route('/index')
def index():
    user = {'username': 'Roberto'}
    return render_template('index.html', title='El gringo', user=user)