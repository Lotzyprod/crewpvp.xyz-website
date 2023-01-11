var videos = [
  '{{ url_for('static', filename='home_background1.mp4') }}',
  '{{ url_for('static', filename='home_background2.mp4') }}',
  '{{ url_for('static', filename='home_background3.mp4') }}',
  '{{ url_for('static', filename='home_background4.mp4') }}',
  '{{ url_for('static', filename='home_background5.mp4') }}',
  '{{ url_for('static', filename='home_background6.mp4') }}'
];
document.getElementById('video').innerHTML = ('<source src="' + videos[Math.floor(Math.random() * videos.length)] + '">');

	document.getElementById('menu_button').style.visibility = 'hidden';
document.getElementById('play_button').style.visibility = 'hidden';
var start_text = '[press to start]';
var start_desc = ' ';
document.addEventListener('click', OnClickEvent);
function OnClickEvent() {
  document.getElementById('black_window').classList.add("black_window--hidden");
    document.getElementById("video").volume = 0.25;
    document.getElementById('video').play();
    document.getElementById('menu_button').style.visibility = 'visible';
    document.getElementById('play_button').style.visibility = 'visible';
    start_desc = 'A modern interests community';
    start_text = 'crewpvp.xyz';
    start_desc_loop();
    document.removeEventListener('click', OnClickEvent);

    document.querySelector('button.play-button').addEventListener('click', function() {
    var button = document.querySelector('button.play-button');
    var video = document.getElementById('video');
    if( !video.paused ) {
      video.pause()
      button.classList.remove('play-button--open');
    }
    else {
      button.classList.add('play-button--open')
      video.play();
    }
  });
}

const start_text_fx = new TextScramble(document.getElementById('start_text'))
const start_desc_fx = new TextScramble(document.getElementById('start_desc'))

const start_text_loop = () => { start_text_fx.setText(start_text).then(() => { setTimeout(start_text_loop, 800)} ); }
const start_desc_loop = () => { start_desc_fx.setText(start_desc).then(() => { setTimeout(start_desc_loop, 1600)} ); }

start_text_loop();

const title = new TextScramble(document.getElementsByTagName("title")[0]);
const loop = () => { title.setText("crewpvp.xyz").then(() => { setTimeout(loop, 1600);}); }
loop();