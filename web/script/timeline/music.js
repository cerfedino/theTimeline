// ============================================================================= UTILITIES
// get the value of the css variable with the specified name
function get_css_variable( name ){
  return getComputedStyle( document.documentElement ).getPropertyValue( name ).trim();
}

// ============================================================================= MUSIC
let audio = null;
let music_on = false;
let music_image = null;
let music_cross = null;
let music_button = null;

let music_interval = null;
let music_volume = 0; // volume in Real : 0 < volume < 1
let max_music_volume = 0.3;
let first_played = false;

function setup_audio(){
  // get the audio button element
  music_button = document.getElementById( 'music-button' );

  // // get the audio images
  music_image = get_css_variable( '--music-button-image' );
  music_cross = get_css_variable( '--music-button-cross' );

  // we get the raw audio variable from css { url("dir/file") }
  let raw_music_file = 'html/timeline/media/music1.wav'

  // let raw_music_file = get_css_variable( '--audio-file' );
  // we extract only the path
  // raw_music_file = raw_music_file.split('"')[1];

  // we create the audio object from that file
  audio = new Audio( raw_music_file );
  // set other stuff
  audio.setAttribute( 'loop', '');
  music_volume = 0.03;
  audio.volume = 0.03;
  // console.log(audio);

  // set the on error function to audio
  audio.onerror = () => {
    // if an error happened
    // remove the audio button
    music_button.style.display = "none";
    // print a message to the console
    console.error("There was an error loading the audio file.\nAudio button hidden to prevent further errors.");
  }

  // link the start/stop of the music to the sound-button
  music_button.onclick = () => {
    music_on = !music_on;

    // turn the music on
    if(music_on) {

      // if first time playing, fade in
      if( !first_played ){
        fade_in(4000);
        first_played = true;

      } else {
        fade_in(500);
      }

      music_button.removeAttribute("muted");

    // turn the music off
    } else {
      fade_out(500);
      music_button.setAttribute("muted", true);
    }
  }

  // this function will make the music fade in
  // it takes 'millis' milliseconds to finish
  function fade_in( millis ){
    let interval = millis * 0.01 / max_music_volume;

    audio.play();

    // set the interval to execute the function each n milliseconds
    clearInterval( music_interval );
    music_interval = setInterval(frame, interval);

    function frame() {
      // console.log( music_volume );

      // always increase the volume
      music_volume += 0.01;
      // if the maximum (1) is reached, crop it to 1 and clear the interval
      if (music_volume >= max_music_volume) {
        music_volume = max_music_volume; // to remove excess floating
        clearInterval(music_interval);
      }
      // set the volume of the object to our volume
      audio.volume = music_volume;
    }
  }

  // this function will make the music fade out
  // it takes 'millis' milliseconds to finish
  function fade_out( millis ){
    let interval = millis * 0.01 / max_music_volume;

    // set the interval to execute the function each n milliseconds
    clearInterval( music_interval );
    music_interval = setInterval(frame, interval);

    function frame() {
      // console.log(music_volume);

      // always increase the volume
      music_volume -= 0.01;
      // if the maximum (1) is reached, crop it to 1 and clear the interval
      if (music_volume <= 0) {
        music_volume = 0; // to remove excess floating
        clearInterval(music_interval);
        audio.pause();
      }
      // set the volume of the object to our volume
      audio.volume = music_volume;
    }
  }

  // initialize the state of the audio
  music_button.setAttribute("muted", true);
}
