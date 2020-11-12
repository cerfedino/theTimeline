// ============================================================================= UTILITIES
function scroll_to( href ){
  if( href ){
    // console.log($( href ).offset().top);
    $( 'html, body' ).animate({
      scrollTop: ($( href ).offset().top - 50)
    }, 500);
  }
}


// ============================================================================= TIMELINE FUNCTIONS
// Collapses all the event containers inside a timeline by removing the .anim-in class.
let collapseTimelineContent = function ( timeline ){
    console.debug( 'Removing class anim-in' );
    //Removes class .anim-in from every .container element inside the timeline
    $( timeline ).children( '.container' ).removeClass( 'anim-in' );
}

// Toggles the collapse on a Timeline
let toggleTimelineCollapse = function (timeline){
    console.debug( 'Toggling timeline:' + timeline);
    switch ($(timeline).hasClass( 'collapsed' )){
        // If the timeline was collapsed, it expands it
        case true:
            collapseTimeline(timeline, false);
            break;
        //If the timeline was expanded, it collapses it
        case false:
            collapseTimeline(timeline, true);
            break;
    }
}

// It expands/collapses a timeline based on 'collapse' boolean input false/true
let collapseTimeline = function (timeline, collapse){
    console.debug( 'Click registered' );

    switch (collapse){
        //If 'collapse' is false, the timeline gets expanded
        case false:
            $(timeline).removeClass( 'collapsed' );
            break;
        //If 'collapse' is true, the timeline gets collapsed
        case true:
            $(timeline).addClass( 'collapsed' );
            collapseTimelineContent(timeline);
            break;
    }

    //Animates the visible containers after the expanding/collapsing of the timeline
    animateVisibleContainers();
};

// ==========================================================================--- CONTAINER FUNCTIONS
//Animates every event container that is in the viewport of the browser by adding the .anim-in class.
let animateVisibleContainers = function(){
    let visibleElements = $( '.container:visible' ).filter(function(i, el) {
        return $(el).visible(true);
    });

    $.each(visibleElements,function(i, el) {

        // For every visible element the class .anim-in gets added with a delay depending on the element number
        //   in order to make the containers animate one after the another
        setTimeout(function(){$(el).addClass( 'anim-in' );}, 140 + (140*i));
    });
}

// ============================================================================= NAVIGATION MENU FUNCTIONS
// Switches the game list in the navigation menu based on a specific generation (genX)
let switchNavmenuToGenX = function(genX){
    //The .active class gets added to the label in the navmenu associated with genX
    $.each($( '.navmenu-entry.gen' ), function (){
        if ($(this).attr( 'href' ) == genX){
            console.debug( 'Adding active' );
            $(this).addClass( 'active' );
        }else{
            //console.debug( 'Removing active' );
            $(this).removeClass( 'active' );
        }
    });

    // Makes the game list of genX visible and the the rest hidden
    $.each($( '#rightpane' ).children( ), function () {
        if ($(this).hasClass(genX)){
            $(this).show();
        }else{
            $(this).hide();
        }
    });
}

// ============================================================================= HANDLERS
// Sets up all he event listeners
let setupHandlers = function(){
  // When the window scroll, it checks if there are any containers to animate
  $(window).scroll(function(){animateVisibleContainers();});

  //When a generation label in the timeline gets clicked, it toggles the timeline associated to it
  $( '.timelineLabel' ).click(function(){toggleTimelineCollapse($(this).next());});

  // When the navmenu button gets clicked, the navmenu gets toggled
  $( '#navmenu-toggle' ).click(function(){
    console.debug( 'navmenu-toggle Click registered' );
    $( '#navmenu' ).toggleClass( 'collapsed' );
  });

  // When a generation label in the navmenu gets clicked, the page scrolls to the specific generation timeline
  $( '.navmenu-entry.gen' ).click(function (){
    console.debug( 'Registered click on navmenu-entry(gen). Going to HREF: ' + $(this).attr( 'href' ) + ' ...' );
    // The associated generation timeline gets expanded to make sure it's visible once it gets scrolled to
    collapseTimeline($(this).attr( 'href' ), false);
    // The page scrolls to the timeline
    scroll_to( '#' + $(this).attr( 'href' ) );
    // $( 'html, body' ).animate({
    //     scrollTop: ($( '#'+$(this).attr( 'href' )).offset().top - 50)
    // },500);
  });

  //When a generation label in the navmenu gets hovered, the game list gets switched
  $( '.navmenu-entry.gen' ).hover(function (){
    console.debug( 'Registered hover on navmenu-entry(gen). Showing list for generation ' + $(this).attr( 'href' ) + ' ...' );
    switchNavmenuToGenX($(this).attr( 'href' ));
  });

  // When a game entry in the navbar gets clicked, the browser gets redirected to its page
  $( '.navmenu-entry.page' ).click(function (){
    console.debug( 'Registered click on navmenu-entry(page). Going to HREF: ' + $(this).attr( 'href' ) + ' ...' );
    window.location.href = $(this).attr( 'href' );
  });

  // When the hash (id) in the url change
  window.addEventListener("hashchange", ( event ) => {
    // console.debug( event );
    scroll_to( window.location.hash );
  });

  // setup the observer that check if an element sticked
  // const observer = new IntersectionObserver(
  //   ([e]) => {
  //     // if( e.intersectionRatio == 1){
  //       console.log(e.target.classList[1], e.intersectionRatio, e);
  //       const targetInfo = record.boundingClientRect;
  //       const stickyTarget = record.target.parentElement.querySelector('.sticky');
  //       const rootBoundsInfo = record.rootBounds;
  //       // e.target.classList.toggle('isSticky', e.intersectionRatio < 1)
  //     // }
  //   }, {
  //     threshold: [0.5],
  //     root: document.getElementById('navbar-button')
  //   }
  // );
  // $( '.timelineLabel' ).each( ( index, element ) => {
  //   observer.observe( element );
  // })
  //
  // document.getElementsByClassName('generationLabel').for;
  // document.addEventListener('sticky-change', e => { console.log(e);});

  // document.addEventListener('sticky-change', e => {
  //   console.log(e);
    // const header = e.detail.target;  // header became sticky or stopped sticking.
    // const sticking = e.detail.stuck; // true when header is sticky.
    // header.classList.toggle('shadow', sticking); // add drop shadow when sticking.
    //
    // document.querySelector('.who-is-sticking').textContent = header.textContent;
  // });

}

// function observeHeaders(container) {
//   const observer = new IntersectionObserver((records, observer) => {
//     for (const record of records) {
//       const targetInfo = record.boundingClientRect;
//       const stickyTarget = record.target.parentElement.querySelector('.sticky');
//       const rootBoundsInfo = record.rootBounds;
//
//       // Started sticking.
//       if (targetInfo.bottom < rootBoundsInfo.top) {
//         fireEvent(true, stickyTarget);
//       }
//
//       // Stopped sticking.
//       if (targetInfo.bottom >= rootBoundsInfo.top &&
//           targetInfo.bottom < rootBoundsInfo.bottom) {
//        fireEvent(false, stickyTarget);
//       }
//     }
//   }, {threshold: [0], root: container});
//
//   // Add the top sentinels to each section and attach an observer.
//   const sentinels = addSentinels(container, 'sticky_sentinel--top');
//   sentinels.forEach(el => observer.observe(el));
// }
//
// function addSentinels(container, className) {
//   return Array.from(container.getElementsByClassName('.sticky')).map(el => {
//     const sentinel = document.createElement('div');
//     sentinel.classList.add('sticky_sentinel', className);
//     return el.parentElement.appendChild(sentinel);
//   });
// }
//
// function fireEvent(stuck, target) {
//   const e = new CustomEvent('sticky-change', {detail: {stuck, target}});
//   document.dispatchEvent(e);
// }

$(document).ready(function(){
  //The navmenu gets generated based on the contents of 'pageMapping.json'
  refreshNavmenu();
  // The full timeline gets generated based on the contents of 'pageMapping.json'
  refreshTimeline();

  // Adds the listeners
  setupHandlers();

  // observeHeaders( document.documentElement );

  //Makes the navigation menu be set do display by default the first generation
  switchNavmenuToGenX($( '.navmenu-entry.gen' ).first().attr( 'href' ));

  setup_audio();
  // setTimeout( music_button.click(), 100 );

  animateVisibleContainers();

  // move to the hash, but wait a little so we can be sure it's loaded
  setTimeout( () => { scroll_to( window.location.hash || '#gen0' ); }, 128 );
});
