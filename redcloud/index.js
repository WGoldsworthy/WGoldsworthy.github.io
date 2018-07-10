$(window).scroll(function() {
	$('.block1').each(function() {
		var blockPosition = $(this).offset().top;
		var blockHeight = $(this).height();
		var topOfWindow = $(window).scrollTop();

		console.log(blockPosition);
		console.log(topOfWindow)

		if(blockPosition < topOfWindow + blockHeight) {
			$(this).addClass("slideUp");
			$('.block2').addClass("slideUp2");
			$('.block3').addClass("slideUp3");
			$('.block4').addClass("slideUp4");
		}
	})
});