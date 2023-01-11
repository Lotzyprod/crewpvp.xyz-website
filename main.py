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
		cursor.execute('CREATE TABLE IF NOT EXISTS site_imageboard (id INT NOT NULL AUTO_INCREMENT, address VARCHAR(15) NOT NULL,date INT(11) NOT NULL DEFAULT UNIX_TIMESTAMP(), content TEXT NOT NULL, CONSTRAINT id PRIMARY KEY (id))')
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
	'home': {'name':'home','html':'/pages/home.html','js':'/pages/home.js', 'data': None},
	'about': {'name':'about','html':'/pages/about.html','js':'/pages/about.js', 'data': None},
	'terminal': {'name':'terminal','html':'/pages/terminal.html','js':'/pages/terminal.js', 'data': {'hostname':hostname}},
	'board': {'name':'board','html':'/pages/board.html','js':'/pages/board.js', 'data': {'hostname':hostname}},
	'404': {'name':'404','html':'/pages/404.html','js':'/pages/404.js', 'data': None}
}

def metric(address):
	cursor = connection.cursor()
	cursor.execute(f'INSERT INTO site_metric (address) VALUES (\'{address}\') ON DUPLICATE KEY UPDATE last_join=UNIX_TIMESTAMP()')
	cursor.close()

def virtualPage(id, includejs):
	if includejs: 
		return {
			'nav': f'<div class="pages-nav__item" id="{id["name"]}"><a class="link link--page" href="#{id["name"]}">{id["name"]}</a></div>',
			'stack':render_template(id['html'],name=id['name'],data=id['data'],javascript='<script type=\'text/javascript\'>'+render_template(id['js'],name=id['name'],data=id['data'])+'</script>') }
	return { 'nav': f'<div class="pages-nav__item" id="{id["name"]}"><a class="link link--page" href="#{id["name"]}">{id["name"]}</a></div>',
			'stack':render_template(id['html'],name=id['name'],data=id['data']),
			'js':render_template(id['js'],name=id['name'],data=id['data'])
		}

@app.route("/")
def home():
	metric(request.remote_addr)
	args = request.args.getlist("pages")
	if (args):
		pages = [virtualPage(virtualPages[page],True) for page in args if page in virtualPages]
	else:
		pages = [virtualPage(virtualPages['home'],True), virtualPage(virtualPages['about'],True), virtualPage(virtualPages['terminal'],True)]
	return render_template("index.html", data={'pages':pages})

@app.route("/api/pages")
def get_pages():
	return jsonify(list(virtualPages.keys())),200

@app.route("/api/pages/<page>", methods = ['GET'])
def get_page(page):
	if virtualPages.get(page):
		return jsonify(virtualPage(virtualPages[page],False)),200
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

@app.route("/api/board/add/<text>")
def add_to_board(text):
	text = " ".join(text.split())
	if (text==""):
		return jsonify({'message':f'Empty text!'}),400
	cursor = connection.cursor()
	cursor.execute(f'SELECT id FROM site_imageboard WHERE address=\'{request.remote_addr}\' AND date+3600>UNIX_TIMESTAMP() ORDER BY id DESC LIMIT 1')
	if(not cursor.fetchone()):
		cursor.execute(f'INSERT INTO site_imageboard (address,content) VALUES (\'{request.remote_addr}\',?)',(text,))
		cursor.close()
		return jsonify({'message':f'Successfully posted new thread!'}),200
	else:
		cursor.close()
		return jsonify({'message':f'You can make new thread only once a hour!'}),400
	
@app.route("/api/board/<int:page>", methods = ['GET'])
def get_board(page):
	cursor = connection.cursor()
	cursor.execute(f'SELECT content,date FROM site_imageboard ORDER BY id DESC LIMIT {(page-1)*10}, 10')
	data = cursor.fetchall()
	cursor.close()
	if (data):
		data = [{'content':content,'date':date} for content,date in data]
		return jsonify(data),200
	return jsonify({'message':f'No one thread older'}),400

@app.errorhandler(404)
def page_not_found(e):
	pages = [virtualPage(virtualPages['404'],True), virtualPage(virtualPages['terminal']),True]
	return render_template("index.html", data={'pages':pages}),404

app.run()

