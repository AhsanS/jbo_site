// script.js
// jQuery script file for 'JBO Landscaping' website
// Created: April 25, 2012
// Updated: May 30, 2012

jQuery(document).ready(function(event) {

  var page = ''; // 'global'
  var inSubmission = false;
  var minGapBetweenContentAndSidebar = 8; // pixels
  var contentWidth = $('#content').outerWidth();
  var sidebarWidth = $('#side_bar').outerWidth();
  var totalWidthOfContentAndSidebar = contentWidth + sidebarWidth + minGapBetweenContentAndSidebar;
  
  houseKeeping();
  positionLeafSketch();
  positionSideBar();


  // -------------------
  //  EVENT DEFINITIONS
  // -------------------

  $(window).resize(function() { // On Window RESIZE
    positionLeafSketch();
    positionSideBar();
  });
  
  $('#services>ol>li').mouseenter(function() {
    positionSideBar();
    var $$ = $(this);
    var i = $('#sevicesList>li').index($$); // index of list item
    var service = $$.text();
    if(i===0) service = 'Lawn Maintenance';
    var description = $('#services_description>p#' + i).text();

    $('#side_bar_content').stop().fadeOut('slow', function() {
      // Animation complete.
      $('#side_bar #add_description h2').fadeTo(0, 0);
      $('#side_bar #add_description p').fadeTo(0, 0);
      $('#side_bar h1').fadeTo(0, 0);
      // $('#side_bar #ontact_us').css('visibility', 'hidden');
      $('#side_bar #add_description h2').html(service);
      $('#side_bar #add_description p').html(description);
      var delay = ($('#side_bar h1').text() == 'Service Details')? 0:200;
      $('#side_bar h1').html('Service Details');
      $('#side_bar h1').stop().fadeTo(delay, 1);
      // $('#side_bar #holly-leaves').stop().fadeTo(delay, 1);
      $('#side_bar #add_description h2').stop().fadeTo(200, 1);
      $('#side_bar #add_description p').stop().fadeTo(200, 1);
      $('#side_bar #add_description').stop().fadeTo(600, 1);
    });
  });

  // $('#content').mouseleave(function() {
  //   $('#side_bar #add_description').css('display', 'none');
  //   $('#side_bar h1').css('display', 'none');
  //   $('#side_bar h1').html('Contact Us');
  //   $('#side_bar h1').stop().fadeTo(750, 1);
  //   $('#side_bar_content').stop().fadeTo(750, 1);
  // });

  $('#content').mouseleave(function() {
    // $('#side_bar #add_description').css('display', 'none');
    // $('#side_bar h1').css('display', 'none');
    $('#side_bar #add_description').stop().fadeOut('slow', function(){
      $('#side_bar h1').html('Contact Us').fadeTo(0, 0);
      $('#side_bar h1').stop().fadeTo(600, 1);
      $('#side_bar_content').stop().fadeTo(600, 1);

    });
  });

  // Validate Contact Form on Keyup in any field
  // (also see 'bind' method call in 'houseKeeping()')
  $("input[name='name'], input[name='email'], input[name='phone'], input[name='message']").keyup(function() { // blur
    validateContactForm();
  });

  $("input[id='contact-submit']").mouseenter(function() {
    if(!inSubmission)
      $(this).css({background: 'DarkGreen'});
  });
  $("input[id='contact-submit']").mouseleave(function() {
    $(this).css({background: 'OliveDrab'});
  });
/*
  $("form").submit(function() {
    $("span").text(" Thank you ...").show().delay(3000).fadeTo(1000, 0);
    // $("span").text("We'll be in touch soon ...").fadeTo(0, 0).show().delay(3000).fadeTo(1000, 1);
    return true;
  });
*/
  

 // AJAX Contact Submit Handling
 $("input[id='contact-submit']").click(function(e){
    $("#side_bar_content #confirmation").css('color', 'OrangeRed');
    $("#side_bar_content #confirmation").text("Please wait ...").show();
    var name = $("input[name='name']").val();
    var email = $("input[name='email']").val();
    var phone = $("input[name='phone']").val();
    var message = $("textarea[name='message']").val();
    /* disableContactSubmitButton(); */
    inSubmission = true;
    $.ajax({
      type: "POST",
      url: "/",
      data: {name: name, email: email, phone: phone, message: message},
      success: function(data){
        $("#side_bar_content #confirmation").stop().fadeOut(300, function(){
          $("#side_bar_content #confirmation").css('color', 'green');
          $("#side_bar_content #confirmation").html("Thank you. We'll be in touch soon.");
          $("#side_bar_content #confirmation").fadeTo(300, 1.0);
        });
      }
    });
    /* enableContactSubmitButton(); */
    inSubmission = false;
    e.preventDefault();
 });

  
  
  // ----------------------
  //  FUNCTION DEFINITIONS
  // ----------------------
  
  // First function to call for housekeeping if Javascript is enabled on user's browser
  function houseKeeping(){
    // Add Class 'currentpage' to nav menu item corresponding to currently displayed page
    // CSS uses this to highlight and disable the menu item
    page = $.trim($('.thispage').text().toLowerCase()); // hidden text identifies page
    $("#nav ol li").each(function() {
      if($(this).text().toLowerCase() === page){
        $(this).addClass('currentpage'); // css uses currentpage class
      }
    });

    // Set min/max width
    $('#header').css('min-width', totalWidthOfContentAndSidebar);
    $('#wrap').css('max-width', totalWidthOfContentAndSidebar+5*minGapBetweenContentAndSidebar);

    // Make service_navigation_instruction visible if JavaScript is enabled
    $('#service_navigation_instruction').css('background', '#FFFF99');
    $('#service_navigation_instruction>p').css({'display': 'block'}).fadeTo(0,0).fadeTo(1000, 1.0).fadeTo(1000, 0).fadeTo(1000, 1.0).fadeTo(1000, 0).fadeIn('slow', function(){$('#service_navigation_instruction').css('background', 'transparent');}).fadeTo(1000,1);

    // Make leaf_sketch visible if JavaScript is enabled
    $('#leaf').css('visibility', 'visible');
    $('#frog').css('visibility', 'visible');
    
    // Make wheelbarrow visible if JavaScript is enabled
    $('#wheelbarrow').css('visibility', 'visible');

    // If Javascript is enabled, change CSS 'float: right' to 'position: absolute' for #side_bar
    $('#side_bar').css({float: 'none', position: 'absolute'});


    // If JavaScript is enabled, change footer image on left (use a bigger flower & grass image)
    var topMargin = $('#flower_grass_big').height() - $('#flower_grass').height() - 10; //alert(topMargin);
    $('#flower_grass').css('display', 'none');
    $('#flower_grass_big').css({'display': 'block', 'position': 'absolute', 'margin-top': -topMargin+'px'}); //

    topMargin = $('#bird_big').height() - $('#flower_grass').height() - 10; //alert(topMargin);
    $('#bird').css('display', 'none');
    $('#bird_big').css({'display': 'block', 'position': 'absolute', 'margin-top': -topMargin+'px', right: 0}); //

    setSideBarHeight();

    // Disable Contact Form Submit Button
    disableContactSubmitButton();

    // Validate Contact Form on change to any field
    $("input[name='name'], input[name='email'], input[name='phone'], input[name='message']").bind("change", validateContactForm);
    
  }
  

  function validateContactForm(){
    var name = $("input[name='name']").val();
    var email = $("input[name='email']").val();
    var nameProblem = (name.length < 2);
    var emailProblem = (email.length === 0) || !isValidEmailAddress(email);
/*     console.log('name=' + name + ', email=' + email + "\n" + 'nameProblem=' + nameProblem + ', emailProblem=' + emailProblem ); */
    if( !nameProblem && !emailProblem){
      enableContactSubmitButton();
        $("input[name='name']").removeClass('red-bordered');
        $("input[name='email']").removeClass('red-bordered');
      }
    else{
      disableContactSubmitButton();
      if(nameProblem && (name.length > 0))
        $("input[name='name']").addClass('red-bordered');
      else
        $("input[name='name']").removeClass('red-bordered');
      if(emailProblem && (email.length > 0))
        $("input[name='email']").addClass('red-bordered');
      else
        $("input[name='email']").removeClass('red-bordered');
    }
    
/*
    if(name.length === 0) $("input[name='name']").removeClass('red-bordered');
    if(email.length === 0) $("input[name='email']").removeClass('red-bordered');
*/
  }

  // http://stackoverflow.com/questions/2855865/jquery-validate-e-mail-address-regex
  function isValidEmailAddress(emailAddress) {
      var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
      var isValid = pattern.test(emailAddress);
      //console.log(isValid? 'true':'false');
      return isValid;
  }

  function disableContactSubmitButton(){
    // Disable Contact Form Submit Button
    $("input[id='contact-submit']").attr("disabled", "disabled");
    $("input[id='contact-submit']").css({'background': 'grey', 'opacity': 0.6, 'cursor': 'default'});
  }

  function enableContactSubmitButton(){
    // Disable Contact Form Submit Button
    $("input[id='contact-submit']").removeAttr("disabled");
    $("input[id='contact-submit']").css({'background': 'OliveDrab', 'opacity': 1.0, 'cursor': 'pointer'});
  }


  // Place leaf_sketch at bottom-right of services-list
  function positionLeafSketch(){ // The function definition
    if(page === 'home'){
      var pos = $('#services').offset();
      var w = $('#services').width();
      var h = $('#services').height();
      var w2 = $('#leaf').width();
      var h2 = $('#leaf').height();
      var pos2 = {left: pos.left+w-w2+6, top: pos.top+h-h2+26};
      $('#leaf').css(pos2).show();
      
      // Position FROG too!
      var pos3 = {left: pos.left-$('#frog').width()+30, top: pos.top+80};
      $('#frog').css(pos3).show();

    }
  }


  function positionSideBar(){
    var mainWidth = $('#main').outerWidth();
    var contentRightEdge = $('#content').offset().left + contentWidth;
    var sidebarLeftEdge = $('#side_bar').offset().left;
    var contentTop = $('#content').offset().top - 36;
    var sidebarAtRightEdgeOfMain = $('#main').offset().left + mainWidth - sidebarWidth;
    
    if(contentRightEdge >= sidebarLeftEdge-minGapBetweenContentAndSidebar){ // content & side_bar touch or overlap
      if(mainWidth > totalWidthOfContentAndSidebar)
        $('#side_bar').css({left: sidebarAtRightEdgeOfMain, top: contentTop}).show();
      else
        $('#side_bar').css({left: contentRightEdge+minGapBetweenContentAndSidebar, top: contentTop}).show();
    }
    else // content & side_bar do not touch or overlap
      $('#side_bar').css({left: sidebarAtRightEdgeOfMain, top: contentTop, width: sidebarWidth}).show();

    setSideBarHeight();
    positionWheelbarrow();    
  }

  function setSideBarHeight(){
    var contentHeight = $('#content').height();
    var sidebarHeight = $('#side_bar').height();
    /* if(sidebarHeight < contentHeight) */
      $('#side_bar').height(contentHeight);

    positionDragonfly();
  }

  // Place wheelbarrow at bottom-right of side_bar
  function positionWheelbarrow(){ // The function definition
      var w = $('#side_bar').outerWidth(true);
      var h = $('#side_bar').height();
      var w2 = $('#wheelbarrow').width();
      var h2 = $('#wheelbarrow').height();
      var pos2 = {left: w-w2+5, top: h-h2+25};
      $('#wheelbarrow').css({position: 'absolute', left: pos2.left+50+'px', top: pos2.top+10+'px'});

      //$('#sunflower1').css({position: 'absolute', left: 24+'px', top: pos2.top+32+'px', opacity: 0.9, display: 'block'});
  }

  // Place dragonfly at bottom-right of side_bar
  function positionDragonfly(){ // The function definition
      var w = $('#side_bar').outerWidth(true);
      var h = $('#side_bar').height();
      var w2 = $('#dragonfly').width();
      var h2 = $('#dragonfly').height();
      var pos2 = {left: w-w2+158, top: h-h2-4};
      $('#dragonfly').css({position: 'absolute', left: pos2.left+'px', top: pos2.top+'px'}); // THIS WORKS!


      $('#icon-email').css({position: 'absolute', left: 24+'px', top: pos2.top+32+'px', display: 'block'})
      ;
  }

});

