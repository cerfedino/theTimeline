// // TODO: nothing for now

let root = null;
let dummy_element = null;

function onload(){
  root = document.documentElement;
  dummy_element = document.createElement( 'div' );

  setup_meta();

  setup_audio();

  setup_back();

  setup_banner();

  // setup_index();

  setup_variables();
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

// return an array containing the string before the first occurrence of 'start,
//                            the string between 'start and 'end,
//                            the string after the first occurrence of 'end following 'start
// example extract_content("aaa:bbb:ccc;ddd;eee:fff;", ":", ";") -> ["aaa:", "bbb:ccc", ";ddd;eee:fff"]
function extract_content( str, start, end ){
  // split the string at 'start
  str = str.split( start );
  // takes out the first element (which is before the first 'start)
  let first = str.shift();
  // merge the remaining strings and put 'start back if it was removed
  str = str.join( start );
  // split the string at 'end
  str = str.split( ';' );
  // takes out the middle element
  let middle = str.shift();
  // merge everything after 'end' and put 'end back if it was removed
  let last = str.join( end )
  // create the resulting array
  let res = [ (first + start), middle, (end + last) ];
  return res;
}

// escape special characters in string
// function html_encode( s ){
//   // put the string in the element
//   dummy_element.innerText = dummy_element.textContent = s;
//   // get the string from the element
//   s = dummy_element.innerHTML;
//   // console.log(dummy_element.innerText, dummy_element.innerHTML);
//   return s;
// }

// ============================================================================= META
let generation = null;
let product = null;
let author = null;

function setup_meta(){
  // get all meta elements
  let els = document.getElementsByTagName("META");
  // cycle through every element
  for (let i = 0; i < els.length; i++) {
    // get the wanted meta(s) value
    switch (els[i].name) {
      case "author":
        author = els[i].content;
        break;
      case "generation":
        generation = els[i].content.toLowerCase().replaceAll( ' ', '_' );
        break
      case "product":
        product = els[i].content.toLowerCase().replaceAll( ' ', '_' );
        break;
    }
  }
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

  // set the on error function to audio
  audio.onerror = () => {
    // if an error happened
    // remove the audio button
    audio_button.style.display = "none";
    // print a message to the console
    console.error("There was an error loading the audio file.\nAudio button hidden to prevent further errors.");
  }

  // link the start/stop of the music to the sound-button
  audio_button.onclick = () => {
    audio_on = !audio_on;

    // turn the music on
    if(audio_on) {
      audio.play();
      audio_button.removeAttribute("muted");

      // if first time playing, fade in
      if( !first_played ){
        audio_volume = 0;
        // use the function defined after this to fade in in 8000 milliseconds
        fade_in(8000);
        first_played = true;
      }

    // turn the music off
    } else {
      audio.pause();
      audio_button.setAttribute("muted", true);
    }
  }

  // this function will make the music fade in
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
    }
  }

  // initialize the state of the audio
  audio_button.setAttribute("muted", true);
}

// ============================================================================= BACK BUTTON
let back_button = null;

function setup_back(){
  // get the back button element
  back_button = get_element( 'back-button' );

  // link the click to the button
  back_button.onclick = () => {
    document.location.href = "../../index.html#" + product;
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
// let index_element = null;
//
// function setup_index(){
//   // get the index element
//   index_element = get_element( 'index' );
//
//   // recursively fix all the links
//   set_index_link( index_element );
// }
//
// // this is the recursive function that fix the links in every child of the index element
// // if the element is an 'a' element, fix it
// // if not, call the function for each of its children
// function set_index_link( el ){
//   // if 'a' elements
//   if( el.nodeName == 'A') {
//     // get the old link
//     let link = el.getAttribute('href');
//     // fix the link
//     link = 'html/' + encodeURIComponent( generation + '_' + product ) +
//             '/' + encodeURIComponent( product ) + '.html' + link;
//     // put the link back
//     el.setAttribute( 'href', link );
//     // fix the target
//     el.setAttribute( 'target', '_parent' );
//     // console.log( "yes", link );
//   }else{
//     // console.log( "no", el );
//     // get all the children
//     let children = el.children;
//     // cycle for every children
//     for (let i = 0; i < children.length; i++) {
//       // call the function for the children in ith position
//       set_index_link( children[i] );
//     }
//   }
// }

// ============================================================================= CSS VARIABLES
let variables_to_fix = [
  '--background-image-left',
  '--background-image-right',
  '--banner-image'
]
let user_style = null;

function setup_variables(){
  // get the user-style
  user_style = get_element( 'user-style' );
  // get the text (content) of the style
  let tx_cont = user_style.innerText;
  // cycle through every variable that need to be fixed
  for (var i = 0; i < variables_to_fix.length; i++) {
    // split the text in three part, before the variable, the variable, after the variable
    let arr = extract_content(tx_cont, variables_to_fix[i], ';');
    // get the url from the variable
    let url = arr[1].split('"')[1];
    // fix the url to be relative to base/style.css and not the page
    url = '../../html/' + encodeURIComponent( generation + '_' + product ) + '/' + url;
    // reconstruct the url syntax
    url = ': url("' + url + '");';
    // put the url back in the array
    arr[1] = url;
    // merge the array to form a string and replace the style text variable with the new string
    tx_cont = arr.join('');
  }
  // replace the style text with the tx_cont
  user_style.innerHTML = tx_cont;
}
