from flask import Flask,jsonify, render_template, render_template_string, url_for,request
from flask_cors import CORS
import mariadb
import sys
import requests
import configparser

app = Flask(__name__)
CORS(app)

config = configparser.ConfigParser()
config.read("config.ini")

def init_tables(connection):
	cursor = connection.cursor()
	try:
		cursor.execute('CREATE TABLE IF NOT EXISTS site_metric (address VARCHAR(15),last_join INT(11) NOT NULL DEFAULT UNIX_TIMESTAMP(), CONSTRAINT address PRIMARY KEY (address))')
	except mariadb.Error as e:
		print(f'Can\'t init tables: {e}')
		sys.exit(1)
	cursor.close()

try:
	connection = mariadb.connect(host=config['database']['host'],user=config['database']['user'], password=config['database']['password'],database=config['database']['database'],port=int(config['database']['port']), autocommit=True)
	print('Connected to the database')
	init_tables(connection)
except mariadb.Error as e:
	print(f'Can\'t connect to the database with reason: {e}')
	sys.exit(1)

hostname = "http://127.0.0.1:5000"
virtualPages = {
	'home': {'name':'home','path':'/pages/home-stack.html', 'data': None},
	'about': {'name':'about','path':'/pages/about-stack.html', 'data': None},
	'terminal': {'name':'terminal','path':'/pages/terminal-stack.html', 'data': {'hostname':hostname}},
	'board': {'name':'board','path':'/pages/board-stack.html', 'data': {'hostname':hostname}}
}

def metric(address):
	cursor = connection.cursor()
	cursor.execute(f'INSERT INTO site_metric (address) VALUES (\'{address}\') ON DUPLICATE KEY UPDATE last_join=UNIX_TIMESTAMP()')
	cursor.close()

def virtualPage(id):
	return {
		'nav': f'<div class="pages-nav__item" id="{id["name"]}"><a class="link link--page" href="#{id["name"]}">{id["name"]}</a></div>',
		'stack':render_template(id['path'],name=id['name'],data=id['data']),
		}

@app.route("/")
def home():
	metric(request.remote_addr)
	args = request.args.getlist("pages")
	if (args):
		pages = [virtualPage(virtualPages[page]) for page in args if page in virtualPages]
	else:
		pages = [virtualPage(virtualPages['home']), virtualPage(virtualPages['about']), virtualPage(virtualPages['terminal'])]
	return render_template("index.html", data={'pages':pages})

@app.route("/api/pages")
def get_pages():
	return jsonify(list(virtualPages.keys())),200

@app.route("/api/pages/<page>", methods = ['GET'])
def get_page(page):
	if virtualPages.get(page):
		return jsonify(virtualPage(virtualPages[page])),200
	return jsonify({'message':f'page "{page}" doesn\'t exists'}),400

@app.route("/api/metrics")
def get_metrics():
	resp = {}
	cursor = connection.cursor()
	cursor.execute('SELECT COUNT(*) FROM site_metric WHERE last_join>UNIX_TIMESTAMP()-(60*60*24)')
	resp['day'] = cursor.fetchone()[0]
	cursor.execute('SELECT COUNT(*) FROM site_metric WHERE last_join>UNIX_TIMESTAMP()-(60*60*24*31)')
	resp['month'] = cursor.fetchone()[0]
	cursor.execute('SELECT COUNT(*) FROM site_metric')
	resp['all'] = cursor.fetchone()[0]
	cursor.close()
	return jsonify(resp),200

@app.errorhandler(404)
def page_not_found(e):
	return render_template('404.html'), 404

app.run()

