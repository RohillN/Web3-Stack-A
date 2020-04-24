from flask import Flask, render_template, redirect, url_for, request, make_response, jsonify
from mongoengine import *
import os
import json
import csv

app = Flask(__name__)

app.config.from_object('config')

connect('my_database')

class User(Document):
	email = StringField()
	first_name = StringField()
	last_name = StringField()

class Country(Document):
	name = StringField()

@app.route('/')
@app.route('/index')
@app.route('/home')
def hello_world():  
	country = []
	path = os.path.join(app.config['FILES_FOLDER'], "data1.csv")
	f = open(path)
	r = csv.reader(f)
	d = list(r)
	for data in d:
		country.append({
			"name" : data
		})
	return render_template('index.html', info=country), 200
	
@app.route('/inspiration')
def inspiration():
	return render_template('inspiration.html')
	
@app.route('/loadData')
def loadData():
	Country(name="New Zealand").save()
	Country(name="Australia").save()
	Country(name="America").save()
	Country(name="Japan").save()
	return "Success"

@app.route('/countries', methods=['GET'])
@app.route('/countries/<country_name>', methods=['GET'])
def test(country_name=None):
	country = None
	if country_name is None:
		country = Country.objects
	else:
		country = Country.objects.get(name=country_name)
	return country.to_json()

@app.route('/postCountries', methods=['POST'])
def postCountries():
	req = request.get_json()
	print(req)
	response = make_response(jsonify(req), 200)
	return response


if __name__ =="__main__":
    app.run(host='0.0.0.0', port=80)
