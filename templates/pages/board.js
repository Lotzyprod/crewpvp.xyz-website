async function load_posts(page) {
	try {
		let response = await fetch('{{ data['hostname'] | safe}}/api/board/'+page);
		if (!response.ok) throw new Error(response.statusText);
		response = await response.json();
		let posts = []
		for (var post in response) {
			date = new Date(response[post]['date']*1000).toLocaleString().split(', ')
			posts.push('<div class="new-post">'+
				'<ul class="user_comment">'+
				'<div class="comment_body"><p>'+
				response[post]['content']+
				'</p></div><div class="comment_toolbar">'+
				'<div class="comment_details"><ul>'+
				'<li>'+date[0]+'</li><li>'+date[1]+'</li>'+
				'</ul></div></div></ul></div>');
		}
		return posts;
	} catch(err) {
		return null;
	}
}
var boardpage = 1;
(async() => {
	var posts = await load_posts(1);
	if (posts) { 
		document.querySelector('#board_history').innerHTML+=posts.join('');
		boardpage+=1;
	}
})();
document.querySelector('.board-loadmore').addEventListener('click', async e => {
	var posts = await load_posts(boardpage);
	if (posts) {
		document.querySelector('#board_history').innerHTML+=posts.join('');
		boardpage+=1;
	} else {
		document.querySelector('.board-loadmore').innerHTML='No one more posts behind';
	}
});
document.querySelector('.board-textarea').addEventListener('keydown', async e => {
	let textarea = document.querySelector('.board-textarea');
	if(e.keyCode === 13) {
		let text = textarea.innerText;
		if(text.replace(/\s/g, "X")!=''){
			response = await fetch('{{ data['hostname'] | safe}}/api/board/add/'+text);
			if (response.ok) {
				text = text.split(' ').join(' ');
				date = new Date(Date.now()).toLocaleString().split(', ');
				document.querySelector('#board_history').innerHTML = '<div class="new-post">'+
				'<ul class="user_comment">'+
				'<div class="comment_body"><p>'+
				text+'</p></div><div class="comment_toolbar">'+
				'<div class="comment_details"><ul>'+
				'<li>'+date[0]+'</li><li>'+date[1]+'</li>'+
				'</ul></div></div></ul></div>'+document.querySelector('#board_history').innerHTML;
			}
		}
		textarea.innerText = "";
	}
});