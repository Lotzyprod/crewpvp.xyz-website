document.querySelector('#path').textContent = 'user@crewpvp~$\xa0';
document.querySelector('#input').addEventListener('keydown', async e => {
	let input = document.querySelector('#input');
	let history = document.getElementById('terminal-history');
	if(e.keyCode === 13) {
		if (input.value == 'clear') {
			history.innerHTML = '';
		} else if (input.value == 'help') {
			history.innerHTML += 'clear - clear the terminal<br>'+
				'stats - show metrics<br>'+
				'pages - show available virtual pages<br>'+
				'page [page name] - open new page<br>'+
				'author - show author of the site<br>'+
				'help - show info about available commands<br>';
		} else if (input.value == 'stats') {
			let response = await fetch('{{ data['hostname'] | safe}}/api/metrics');
				response = await response.json();
			history.innerHTML += 'users for day: '+response['day']+'<br>'+
				'users for month: '+response['month']+'<br>'+
				'users for all time: '+response['all']+'<br>';
		} else if (input.value == 'pages') {
			let response = await fetch('{{ data['hostname'] | safe}}/api/pages');
				response = await response.json();
			history.innerHTML += 'available pages: <br> '+response.join('<br> ')+'<br>';
		} else if (input.value.startsWith('page')) {
			let page = input.value.split(' ');
			if (page.length > 1) {
				page = page[1];
				if (ps.getPagesIds().indexOf(page)<0) {
					try {
						let response = await fetch('{{ data['hostname'] | safe}}/api/pages/'+page);
						if (!response.ok) throw new Error(response.statusText);

						response = await response.json();
						ps.addPage(response.stack,response.js);
						history.innerHTML += "Page "+page+" opened<br>";
					} catch (err) {
						history.innerHTML += "Page "+page+" doesn't exists<br>";
					}
				} else {
					history.innerHTML += "This page already opened<br>";
				}
			} else {
				history.innerHTML += 'Use: page [page name] <br>';
			}
		} else if (input.value == 'author') {
			history.innerHTML += 'Lolzy#7652, yea its me? @ 2016-2022<br>';
		} else {
			history.innerHTML += input.value+': command not found<br>';
		}
		
		input.value = "";
	}
});