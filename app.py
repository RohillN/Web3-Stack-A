from flask import Flask, render_template, redirect, url_for, request
from mongoengine import *
import os
import json

app = Flask(__name__)

app.config.from_object('config')

connect('my_database')

class User(Document):
	user_id = StringField()
	email = StringField()
	first_name = StringField()
	last_name = StringField()

class Country(Document):
	name = StringField()

@app.route('/')
@app.route('/index')
@app.route('/home')
def hello_world():  
    return render_template('index.html')
	
@app.route('/inspiration')
def inspiration():
	return render_template('inspiration.html')
	
@app.route('/loadData')
def loadData():
	return "Success"

if __name__ =="__main__":
    app.run(host='0.0.0.0', port=80)
