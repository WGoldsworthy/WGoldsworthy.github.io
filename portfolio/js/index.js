var current_page = 0;
var scrolled = false;

var scrollDown = function() {
	if (!scrolled) {
		
		console.log("Down")
		
		if (current_page == 0) {
			current_page = 1;
			$(".sunrise").addClass("slideUp").removeClass("slideDown");
			$(".home .text").addClass("slideLeftText").removeClass("slideRightText");
			$(".home .surname").addClass("slideLeftSurname").removeClass("slideRightSurname");
			$(".info").addClass("hide");
			$(".section_one").addClass("unextend_nav").removeClass("extend_nav");
			$(".section_two").addClass("extend_nav");
			setTimeout(function() {
				$('.skills').removeClass('hidden');
				$('.tags').addClass('fadeIn');
				$('.javascript').attr("class", "javascript fillJs");
				$('.css').attr("class", 'css fillJs');
				$('.python').attr("class", 'python fillUpPython')
				$('.java').attr("class", 'java fillUpJava')
			}, 1000);
		}
	}

	scrolled = true;

	setTimeout(function() {
		scrolled = false;
	}, 3000);

}

var scrollUp = function() {
	if (!scrolled) {
		console.log("Up")
	}

	scrolled = true;

	setTimeout(function() {
		scrolled = false;
	}, 3000);

}


$(function() {

	$(window).on( "wheel" , function(e) {

		var delta = e.originalEvent.deltaY;

		if (delta > 0) {
			// Down
			scrollDown();
		} else {
			// Up
			scrollUp();
		}
	})

})
