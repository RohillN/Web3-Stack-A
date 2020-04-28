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
	return render_template('index.html'), 200
	
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

@app.route('/loadcsv')
def loadCSV():
	country = []
	path = os.path.join(app.config['FILES_FOLDER'], "data1.csv")
	f = open(path)
	r = csv.reader(f)
	d = list(r)
	for data in d:
		country.append({
			"name" : data
		})
	return render_template('loadcsv.html', countries=country), 200


@app.route('/getcountries', methods=['GET', 'POST'])
@app.route('/getcountries/<country_name>', methods=['GET'])
def getCountries(country_name=None):
	if request.method == 'GET':
		countryList = []
		country = None
		if country_name is None:
			for c in Country.objects:
				countryList.append({'name' : c.name})
		else:
			country = Country.objects.get(name=country_name)
			countryList.append({'name' : country.name})
		return jsonify(countryList)
	
	if request.method == 'POST':
		req = request.form.get('name')
		Country(name=req).save()
		return req

@app.route('/postcountries', methods=['POST'])
def postCountries():
	req = request.form.get('name')

	console.log(req)
	print(req)
	Country(name=req).save()
	return jsonify(req)

@app.route('/countries')
def viewcountry():
	return render_template('/countries.html')

if __name__ =="__main__":
    app.run(host='0.0.0.0')
