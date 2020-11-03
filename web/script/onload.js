let root = null;
let dummy_element = null;

function onload(){
  root = document.documentElement;
  dummy_element = document.createElement( 'div' );

  setup_audio();

  setup_back();

  setup_banner();

  setup_index();
}

// ============================================================================= UTILITIES

// get the element with the specified id
function get_element( id ){
  return document.getElementById( id );
}

// get the value of the css variable with the specified name
function get_css_variable( name ){
  return getComputedStyle(root).getPropertyValue( name ).trim();
}

// escape special characters in string
function html_encode( s ){
  // put the string in the element
  dummy_element.innerText = dummy_element.textContent = s;
  // get the string from the element
  s = dummy_element.innerHTML;
  console.log(dummy_element.innerText, dummy_element.innerHTML);
  return s;
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
  audio_button = get_element( 'sound-button' );
  // get the audio images
  audio_image = get_css_variable( '--soundbutton-image' );
  audio_cross = get_css_variable( '--soundbutton_cross' );
  // we get the raw audio variable from css { url("dir/file") }
  let raw_audio_file = get_css_variable( '--audio-file' );
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
      // console.log(audio_volume);
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
  back_button = get_element( 'back-button' );
  // get the info
  milestone = get_css_variable( '--milestone');
  milestone = milestone.split('"')[1];
  product = get_css_variable( '--product');
  product = product.split('"')[1];

  // link the click to the button
  back_button.onclick = () => {
    document.location.href = "index.html#" + product;
  }
}

// ============================================================================= BANNER
let banner_element = null;
let banner_image = null;

function setup_banner(){
  // get the banner image element
  banner_element = get_element( 'banner' ).firstElementChild;
  // get the banner image
  banner_image = get_css_variable( '--banner-image' );
  banner_image = banner_image.split('"')[1];

  // set element src attribute
  banner_element.setAttribute("src", banner_image)
}

// ============================================================================= INDEX
let index_element = null;

function setup_index(){
  // get the index element
  index_element = get_element( 'index' );

  // recursively fix all the links
  set_index_link( index_element );

}

// this is the recursive function that fix the links in every child of the index element
// if the element is an 'a' element, fix it
// if not, call the function for each of its children
function set_index_link( el ){
  // if 'a' elements
  if( el.nodeName == 'A') {
    // get the old link
    let link = el.getAttribute('href');
    // fix the link
    link = 'html/' + encodeURIComponent( milestone + '_' + product ) +
            '/' + encodeURIComponent( product ) + '.html' + link;
    // put the link back
    el.setAttribute( 'href', link );
    // fix the target
    el.setAttribute( 'target', '_parent' );
    console.log( "yes", link );
  }else{
    console.log( "no", el );
    // get all the children
    let children = el.children;
    // cycle for every children
    for (let i = 0; i < children.length; i++) {
      // call the function for the children in ith position
      set_index_link( children[i] );
    }
  }
}
