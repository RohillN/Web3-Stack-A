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
				countryList.append({'name' : c.name, 'data' : c.data})
		if country_name is not None:
			for c in Country.objects:
				if c.name == country_name:
					countryList.append({'name' : c.name, 'data' : c.data})
		return jsonify(countryList)
	
	if request.method == 'POST':
		reqName = request.form.get('name')
		#reqPopulation = request.form.get('population')
		Country(name=reqName).save()
		return reqName
	
	if request.method == 'DELETE':
		delete = request.form.get('dCountry')
		if country_name is not None:
			for c in Country.objects:
				countryList.append({'name' : c.name, 'data' : c.data})
				print(countryList)
				if c.name == country_name:
					Country.objects(name=c.name).delete()
					countryList.remove({'name' : c.name, 'data' : c.data})
		return jsonify(countryList)
		

@app.route('/countries')
def viewcountry():
	return render_template('/countries.html')

if __name__ =="__main__":
    app.run(host='0.0.0.0', port=80)
