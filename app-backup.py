from flask import Flask, render_template, redirect, url_for
from mongoengine import *

app = Flask(__name__)

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
        return render_template('index.html')
	
@app.route('/inspiration')
def inspiration():
        return render_template('inspiration.html')
	
@app.route('/forloop')
def for_loop():
        return render_template('forloop.html')
	
@app.route('/template')
def view():
	myName = "Rohill"
	return render_template('forloop.html', name=myName)
	
@app.route('/redirection')
@app.route('/re-direction')
@app.route('/direction')
def redirect_route():
	return redirect(url_for('view'))
	
@app.route('/users', methods=['GET'])
def users():
	User(email='rohillnand1@gmail.com', first_name='Rohill', last_name='Nand').save()
	User(email='test@gmail.com', first_name='test-first', last_name='test-last').save()
	user = User.objects
	return user.to_json()

@app.route('/listAllUsers')
def list_all_users():
	User(email='rohillnand1@gmail.com', first_name='Rohill', last_name='Nand').save()
	User(email='test@gmail.com', first_name='test-first', last_name='test-last').save()
	currentUser = []
	for u in User.objects:
		currentUser.append(u.first_name)
	return render_template('listUsersTest.html', name=currentUser)
	
@app.route('/listUsers')
def list_user():
	return User.objects.to_json()

@app.route('/testGetMethod', methods=['GET'])
def testGetMethod():
	User(user_id='1', email='rohillnand1@gmail.com', first_name='Rohill', last_name='Nand').save()
	User(user_id='2', email='test@gmail.com', first_name='test-first', last_name='test-last').save()
	users = User.objects
	return users.to_json()

@app.route('/users/<user>', methods=['GET'])
def getUserById(user):
    users = User.objects.get(user_id=user)
    return users.to_json()

@app.route('/countries', methods=['GET'])
def getAllCountries():
        Country(name='New Zealand').save()
        countries = Country.objects
        return countries.to_json()

@app.route('/countries')
def getAllCountries():
    path = os.path.join(app.config['FILES_FOLDER'],"data1.csv")
	f = open(path)
	r = csv.reader(f)
	d = list(r)
	for data in d:
		print (data)
	
@app.route('/countries/<countries_id>', methods=['GET'])
def getUserById(countries_id):
    countries = Country.objects.get(name=countries_id)
    return countries.to_json()

@app.route('/putCountries', methods=['PUT'])
def putCountries():
    countries = Country.objects
    return countries.to_json()

@app.route('/deleteCountries', methods=['DELETE'])
def deleteCountries():
    countries = Country.objects
    return countries.to_json()

if __name__ =="__main__":
    app.run(debug=True, port=8080)
    app.run(host='0.0.0.0', port=80)





@app.route('/countries', methods=['GET'])
def countries():
	currentCountry = []
	for c in Country.object():
		currentCountry.append({ "name" : c.name })
	return render_template('countries.html', countries = currentCountry)
