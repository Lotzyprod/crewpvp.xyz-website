<script type="text/javascript">
	document.querySelector('#path').textContent = 'user@crewpvp~$\xa0';
	document.querySelector('#input').addEventListener('keydown', async function (e) {
		input = document.querySelector('#input');
		if(e.keyCode === 13) {
			var resp = await fetchAsync('https://crewpvp.xyz/api/terminal_command/'+input.value);
			if (resp == '') {
				document.getElementById('history').innerHTML = '';
			} else {
				document.getElementById('history').innerHTML += resp;
			}
			input.value = "";
		}
	});
</script>