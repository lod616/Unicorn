/*import libs*/

//= libs/libs.js

/*var elem = document.querySelector('.featured-section');
var flkty = new Flickity( elem, {
  // options
  cellAlign: 'left',
	contain: true,
	imagesLoaded: true,
	groupCells: 3,
	wrapAround: true
});

// element argument can be a selector string
//   for an individual element
var flkty = new Flickity( '.featured-section', {
  // options
});*/

$(document).ready(function(){
  $('.js-featured-slider').slick({
		slidesToShow: 3,
		nextArrow: '.navigation-next',
		prevArrow: false,
		dots: false,
		
		// the magic
		responsive: [{

      breakpoint: 1150,
      settings: {
        slidesToShow: 2,
        infinite: true
      }

    }, {

     breakpoint: 780,
      settings: {
				slidesToShow: 1,
				infinite: true,
        dots: false
      }

    }, {

      breakpoint: 320,
      settings: "unslick" // destroys slick
    }]
  });
});

$(document).ready(function(){
  $('.clients-slider').slick({
		slidesToShow: 6,
		slidesToScroll: 1,
		nextArrow: '.navigation-clients',
		prevArrow: false,
		dots: false,
		responsive: [
			{
				breakpoint: 780,
				settings: {
					slidesToShow: 3,
					infinite: true,
					dots: false,
				}
			},

			{
				breakpoint: 450,
				settings: {
					slidesToShow: 2,
				}
			},

			{
				breakpoint: 380,
				settings: {
					slidesToShow: 1,
				}
			}
		]
  });
});


$(document).ready(function(){
  $('.portfolio-js-slider').slick({
		slidesToShow: 4,
		slidesToScroll: 1,
		arrows: false,
		dots: true,
		variableWidth: true
  });
});

$(document).ready(function(){
  $('.js-date-slider').slick({
		slidesToShow: 3,
		slidesToScroll: 1,
		nextArrow: '.date-navigation__right',
		prevArrow: false,
		dots: false,
		responsive: [
			{
				breakpoint: 700,
				settings: {
					slidesToShow: 2,
					infinite: true,
					dots: false,
				}
			},

			{
				breakpoint: 450,
				settings: {
					slidesToShow: 1,
					infinite: true,
					dots: false,
				}
			},

		]
  });
});


function showBurger(){
	const burger = document.querySelector('.header-burger');
	const headerList = document.querySelector('.header-list');
	const navLinks = document.querySelectorAll('.header-list__item');

	burger.addEventListener('click', () => {
		//toggle nav
		headerList.classList.toggle('header-burger--active');

	//Animate links
	navLinks.forEach((link,index) => {
		 if(link.style.animation){
			 link.style.animation = ''
		 }else{
			 link.style.animation = `navLinkFade 0.8s ease forwards ${index / 7 + 0}s`;
	   	}
		});
		burger.classList.toggle('header-burger--animation');
	});
};
showBurger();