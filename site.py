from flask import Flask, render_template, render_template_string, url_for
import sys
from datetime import datetime
import requests
import configparser
import mariadb

app = Flask(__name__)


config = configparser.ConfigParser()
config.read("config.ini")

try:
	connection = mariadb.connect(host=config['database']['host'],user=config['database']['user'], password=config['database']['password'],database=config['database']['database'],port=config['database']['port'], autocommit=True)
	now = datetime.now().strftime("[%d/%m/%Y %H:%M:%S]")
	print(f'{now} Connected to the database')
except mariadb.Error as e:
	now = datetime.now().strftime("[%d/%m/%Y %H:%M:%S]")
	print(f'{now} Cant connect to the database with reason: {e}')
	sys.exit(1)


virtualPages = {}


virtualPages = {
	'home': {'name':'home','path':'/pages/home'},
	'about': {'name':'about','path':'/pages/about'},
	'terminal': {'name':'terminal','path':'/pages/terminal'}
}


def virtualPage(id):
	return {
		'nav': f'<div class="pages-nav__item"><a class="link link--page" href="#{id["name"]}">{id["name"]}</a></div>',
		'stack':render_template(id['path']+'-stack.html',name=id['name']),
		'javascript':render_template(id['path']+'.js')
		}

@app.route("/")
def home():
	pages = [virtualPage(virtualPages['home']), virtualPage(virtualPages['about']), virtualPage(virtualPages['terminal'])]
	return render_template("index.html", data={'pages':pages})


@app.route("/api/get_page/<page>", methods = ['GET'])
def get_page(page):
	if virtualPages.has_key(page):
		return virtualPage(virtualPages[page])
	return {'error':'Page not found'}


@app.route("/api/terminal_command/<cmd>", methods = ['GET'])
def terminal_command(cmd):
	if cmd == 'author':
		return 'Lolzy#7652, yea its me? @ 2017-2022<br/>'
	elif cmd == 'help':
		return ' clear - clear terminal<br/>' + ' author - whos that created?<br/>' + ' stats - show statistics of community<br/>'
	elif cmd == 'clear':
		return ''
	else:
		return cmd + ': command not found<br/>'

app.run()

