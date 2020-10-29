let root = null;

function onload(){
  root = document.documentElement;

  setup_variables();

  setup_audio();

  setup_back();

  setup_banner();
}

// ============================================================================= :root VARIABLES
let css_variables = [
  "--background-image-left",
  "--background-image-right",
  "--background-fade-color",
  "--banner-image",
  "--banner-color",
  "--audio-file",
  "--container-background-color",
  "--container-text-color",
  "--index-background-color",
  "--index-text-color",
  "--index-border-color",
  "--backbutton-image",
  "--backbutton-color",
  "--soundbutton-image",
  "--soundbutton-cross",
  "--soundbutton-color",
  "--page-font",
  "--link-color-hover",
  "--milestone",
  "--product"
]

function setup_variables(){
  // initialize the new object
  let new_css_variables = {}
  // cycle through every variable
  for(let i=0; i<css_variables.length; ++i){
    // get the ith variable
    let name = css_variables[i];
    // get the value of the css variable
    let value = getComputedStyle(root).getPropertyValue( name );
    // remove the first two '-' from the name
    name = name.substring(2);
    // replace the '-' with '_' in the name
    name = name.replaceAll('-', '_');
    // trim the spaces before and after the value
    value = value.trim();
    // add the stuff to the new css variables
    new_css_variables[name] = value;
  }
  // replace the array with the newly constructed object
  css_variables = new_css_variables;
}


// ============================================================================= AUDIO
let audio = null;
let audio_on = false;
let audio_image = null;
let audio_cross = null;
let audio_button = null;

let audio_interval = null;
let audio_volume = 1; // volume in Real : 0 < volume < 1
let first_played = false;

function setup_audio(){
  // get the audio button element
  audio_button = document.getElementById('sound-button');
  // get the audio images
  audio_image = css_variables.soundbutton_image;
  audio_cross = css_variables.soundbutton_cross;
  // we get the raw audio variable from css { url("dir/file") }
  let raw_audio_file = css_variables.audio_file;
  // we extract only the path
  raw_audio_file = raw_audio_file.split('"')[1];
  // we create the audio object from that file
  audio = new Audio( raw_audio_file );

  // link the start/stop of the music to the sound-button
  audio_button.onclick = () => {
    audio_on = !audio_on;
    if(audio_on) {
      audio.play();
      audio_button.removeAttribute("muted");

      if( !first_played ){
        audio_volume = 0;
        fade_in(8000);
        first_played = true;
      }
    } else {
      audio.pause();
      audio_button.setAttribute("muted", true);
    }
  }

  // animation of the fade in
  // it takes 'millis' milliseconds to finish
  function fade_in( millis ){
    let interval = millis * 0.01;

    // set the interval to execute the function each n milliseconds
    audio_interval = setInterval(frame, interval);
    function frame() {
      // always increase the volume
      audio_volume += 0.01;
      // if the maximum (1) is reached, crop it to 1 and clear the interval
      if (audio_volume >= 1) {
        audio_volume = 1; // to remove excess floating
        clearInterval(audio_interval);
      }
      // set the volume of the object to our volume
      audio.volume = audio_volume;
      console.log(audio_volume);
    }
  }

  // initialize the state of the audio
  audio_button.setAttribute("muted", true);
}

// ============================================================================= BACK BUTTON
let milestone = null;
let product = null;
let back_button = null;

function setup_back(){
  // get the back button element
  back_button = document.getElementById('back-button');
  // get the info
  milestone = css_variables.milestone;
  milestone = milestone.split('"')[1];
  product = css_variables.product;
  product = product.split('"')[1];

  // link the click to the button
  back_button.onclick = () => {
    document.location.href = "../index.html#" + product;
  }
}

// ============================================================================= BANNER
let banner_element = null;
let banner_image = null;

function setup_banner(){
  // get the banner image element
  banner_element = document.getElementById('banner').firstElementChild;
  // get the banner image
  banner_image = css_variables.banner_image;
  banner_image = banner_image.split('"')[1];

  // set element src attribute
  banner_element.setAttribute("src", banner_image)
}
