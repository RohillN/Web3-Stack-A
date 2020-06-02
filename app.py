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
	data = DictField()

@app.route('/')
@app.route('/index')
@app.route('/home')
def hello_world():  
	return render_template('index.html'), 200
	
@app.route('/inspiration')
def inspiration():
	return render_template('inspiration.html')

@app.route('/documentation')
def documentation():
	return render_template('documentation.html')

@app.route('/graph')
def graph():
	return render_template('graph.html')

@app.route('/loadcsv')
def loadCSV():
	for file in os.listdir(app.config['FILES_FOLDER']):
		filename = os.fsdecode(file)
		path = os.path.join(app.config['FILES_FOLDER'],filename)
		f = open(path)
		r = csv.DictReader(f) 
		d = list(r)
		for data in d:
			country = Country() # a blank placeholder country
			dict = {} # a blank placeholder data dict
			for key in data: # iterate through the header keys
				if key == "country":
					if Country.objects(name=data[key]).count() > 0:
						country = Country.objects.get(name=data[key])
						dict = country.data
					else:
						country.name = data[key]     
				else:
					f = filename.replace(".csv", "") # we want to trim off the ".csv" as we can't save anything with a "." as a mongodb field name
					if f in dict: # check if this filename is already a field in the dict
						dict[f][key] = data[key] # if it is, just add a new subfield which is key : data[key] (value)
					else:
						dict[f] = {key:data[key]} # if it is not, create a new object and assign it to the dict

				# add the data dict to the country
				country.data = dict
			
			country.save()

	#return Country.objects.to_json()
	return "Success"



@app.route('/getcountries', methods=['GET', 'POST'])
@app.route('/getcountries/<country_name>', methods=['GET', 'DELETE'])
def getCountries(country_name=None):
	countryList = []
	if request.method == 'GET':
		country = None
		if country_name is None:
			for c in Country.objects:
				countries = Country.objects
				return countries.to_json(), 200
		if country_name is not None:
			countries = Country()
			if Country.objects(name=country_name).count() > 0:
				countries = Country.objects.get(name=country_name)
			else:
				countries.name = "Error"
				countries.data = "Not Found - Please ensure country exisits."
			return countries.to_json(), 200
	
	if request.method == 'POST':
		newCountry = Country()
		dict = {}
		reqName = request.form.get('name')
		if Country.objects(name=reqName).count() > 0:
			newCountry = Country.objects.get(name=reqName)
			dict = newCountry.data
		else:
			newCountry.name = reqName
			newCountry.dict = dict
		newCountry.save()
		return newCountry.to_json(), 200
	
	if request.method == 'DELETE':
		delete = request.form.get('dCountry')
		newCountry = Country()
		message = ""
		if country_name is not None:
			if Country.objects(name=country_name).count() > 0:
				newCountry = Country.objects.get(name=country_name)
				newCountry.delete()
				message = "Success Deleted Country"
			else:
				message = "Error Invalid Country"
		return message, 200

@app.route('/countries')
def viewcountry():
	return render_template('/countries.html')

if __name__ =="__main__":
    app.run(host='0.0.0.0', port=80)
