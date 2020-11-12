// ============================================================================= UTILITIES
function new_el( type ){
  return document.createElement( type );
}

function remove_all_child( parent ) {
    while ( parent.firstChild ) {
        parent.removeChild( parent.firstChild );
    }
}

// normalize the text ' ' to '_' remove accents ...
function normalize_text( text ){
  // to lowercase and replace ' ' with '_'
  text = text.toLowerCase().replaceAll( ' ', '_' );
  // replace accented letters with normal ones
  text = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  return text;
}

// all the info are stored in the variable: pages;
// remove bad content
delete pages['-1'];
// debug print the JSONobj
console.debug(pages);

// ============================================================================= NAVMENU CONTENT GENERATION
function generate_navmenu_content(){

    let navmenu = new_el('tr');

    //Returns the generated left pane of the navmenu
    function generate_left_pane(){

      let left_pane = new_el('td');
      left_pane.setAttribute( 'id', 'leftpane');

      let ul = new_el('ul');
      left_pane.appendChild( ul );

      // For every generation a navmenu generation label is generated
      Object.keys( pages ).forEach( (gen_name) => {

        let li = new_el('li');
        li.classList.add('navmenu-entry');
        li.classList.add('gen');
        li.setAttribute( 'href', gen_name );
        li.innerText = gen_name;
        ul.appendChild( li );
      });

      return left_pane;
    }

    //Returns the generated right pane of the navmenU
    function generate_right_pane(){

      let right_pane = new_el('td');
      right_pane.setAttribute( 'id', 'rightpane');

      // For every generation, an unordered list is generated
      Object.keys( pages ).forEach( (gen_name) => {

        let ul = new_el('ul');
        ul.classList.add( gen_name );

        right_pane.appendChild(ul);

        // For every page in the generation, a list item is generated
        pages[ gen_name].pages.forEach(( page ) => {

          let li = new_el('li');
          li.classList.add( 'navmenu-entry' );
          li.classList.add( 'page' );
          li.setAttribute( 'href', page.href );
          li.innerText = page.product;

          ul.appendChild(li);
        });
      });

      return right_pane;
    }

    navmenu.appendChild( generate_left_pane() );
    navmenu.appendChild( generate_right_pane() );

    console.debug(navmenu);
    return navmenu;
}

// Regenerates the navmenu content
function refreshNavmenu(){
    let navmenu = document.getElementById( 'navmenu' );
    // First it clears the content of the navmenu
    remove_all_child( navmenu );
    // Then puts the generated navmenu content inside of it
    navmenu.appendChild( generate_navmenu_content() );
}

// ============================================================================= TIMELINE
// ==========================================================================--- PRODUCT
function generate_product_container(page_jsonobj, place_left){

  let placement;
  if (place_left){
    placement = "left";
  }else{
    placement = "right";
  }

  // set the container div
  let product_container = new_el( 'div' );
  product_container.classList.add( 'container' );
  product_container.classList.add( placement );
  product_container.setAttribute( 'id', normalize_text( page_jsonobj.product ) );

  // set the content div
  let content = new_el( 'div' );
  content.classList.add( 'content' );
  content.addEventListener( 'click', () => {
    window.location.href = page_jsonobj.href;
  });
  product_container.appendChild( content );

  // set the contents
  let picture = new_el( 'img' );
  picture.setAttribute( 'src', page_jsonobj.picture );
  picture.classList.add( 'picture' );
  content.appendChild( picture );

  let title = new_el( 'h2' );
  title.innerText = page_jsonobj.product;
  title.classList.add( 'title' );
  content.appendChild( title );

  let date = new_el( 'h3' );
  date.innerText = page_jsonobj.date;
  date.classList.add( 'date' );
  content.appendChild( date );

  let description = new_el( 'p' );
  description.innerText = page_jsonobj.description;
  description.classList.add( 'description' );
  content.appendChild( description );

  let author = new_el( 'p' );
  author.innerText = page_jsonobj.author;
  author.classList.add( 'author' );
  content.appendChild( author );

  return product_container;
}

// ==========================================================================--- GENERATION TIMELINE
function generate_timeline( gen_name, place_left ){

  // set the timeline container
  let timeline_container = new_el( 'div' );
  timeline_container.classList.add( 'timelineContainer' );
  timeline_container.classList.add( gen_name );

  // set label
  let label = new_el( 'div' );
  label.classList.add( 'timelineLabel' );
  label.classList.add( gen_name );
  timeline_container.appendChild( label );

  let h1 = new_el( 'h1' );
  h1.innerText = gen_name.toUpperCase();
  label.appendChild( h1 );

  // set the timeline
  let timeline = new_el( 'div' );
  timeline.classList.add( 'timeline' );
  timeline.setAttribute( 'id', gen_name );
  timeline_container.appendChild( timeline );

  // set timeline products
  pages[ gen_name ].pages.forEach(( product ) => {
    // set product container
    let product_container = generate_product_container( product, place_left );
    timeline.appendChild( product_container );
    place_left = !place_left;
  });

  // return the container and the left state
  return [ timeline_container, place_left ];
}

// Generates the full timeline, composed of the timelines of every generation
function generate_all_timelines(){
  // get fulltimeline element
  let fulltimeline = document.getElementById( 'fulltimeline' );

  // starting side
  let place_left = false;

  // set all timelines
  Object.keys( pages ).forEach(( gen_name ) => {

    let result = generate_timeline( gen_name, place_left );
    place_left = result[1];

    // append timeline
    fulltimeline.appendChild( result[0] );
  });
}

// Regenerates the full timeline
function refreshTimeline(){
  let fulltimeline = document.getElementById( 'fulltimeline' );
  // First it clears the content of the current fulltimeline
  remove_all_child( fulltimeline );
  // Then puts the newly generated fulltimeline content inside of it
  generate_all_timelines();
}
