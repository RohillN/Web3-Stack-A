from flask import Flask, render_template, redirect, url_for, request
from mongoengine import *
import os
import json
import csv

app = Flask(__name__)

app.config.from_object('config')

connect('my_database')

class Country(Document):
	name = StringField()

@app.route('/')
@app.route('/index')
@app.route('/home')
def hello_world():  
	country = []
	countryName = []
	path = os.path.join(app.config['FILES_FOLDER'], "data1.csv")
	f = open(path)
	r = csv.reader(f)
	d = list(r)
	for data in d:
		country.append({
			"name" : data
		})
	return render_template('index.html', info=country)
	
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

@app.route('/getCountries', methods=['GET'])
def getCountries():
    countries = Country.objects
    return countries.to_json()

@app.route('/countries/<countries_id>', methods=['GET'])
def getUserById(countries_id):
    countries = Country.objects.get(name=countries_id)
    return countries.to_json()

@app.route('/putCountries', methods=['PUT'])
def putCountries():
    countries = Country.objects
    return countries.to_json()

@app.route('/postCountries', methods=['POST'])
def postCountries():
    countries = Country.objects
    return countries.to_json()

@app.route('/deleteCountries', methods=['DELETE'])
def deleteCountries():
    countries = Country.objects
    return countries.to_json()


if __name__ =="__main__":
    app.run(host='0.0.0.0', port=80)
