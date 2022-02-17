'use strict';

///////////////////////////////////////
// Modal window

//Selecting elements
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');

document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button');

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


//Implementing Smooth Scroll
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function(e) {
  const s1coords= section1.getBoundingClientRect();
  //console.log(e.target.getBoundingClientRect());
  console.log('Current Scroll (X/Y):', window.pageXOffset, window.pageYOffset);
  console.log('height/width viewport', document.documentElement.clientHeight, document.documentElement.clientWidth);
  //Scroll
  //window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset);

  /*old method for smooth scroll
  window.scrollTo({
    left: s1coords.left + window.pageXOffset, 
    top: s1coords.top + window.pageYOffset,
    behavior: 'smooth',
  })*/

  //modern smooth scroll method
  section1.scrollIntoView({behavior: 'smooth'});
});

//Page Naviagtion
/*document.querySelectorAll('.nav__link').forEach(function(el) {
  el.addEventListener('click', function(e) {
    e.preventDefault();
    const id = this.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({behavior: 'smooth'});
  })
});*/

//Page Navigation with Event Delegation so basically we need two steps, first we add the event listener to a common parent element of all the elements that we are interested in after that in that event listener determine what element originated that event
document.querySelector('.nav__links').addEventListener('click', function(e) {
  e.preventDefault();
  if(e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({behavior: 'smooth'});
  }
}); 


//Tabbed Component
tabsContainer.addEventListener('click', function(e) {
  const clicked = e.target.closest('.operations__tab');
  //Guard close
  //This helps when we click on a section of the tabs container that doesnt have the operations tabs class
  if(!clicked) return;

  //Active tab
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  //Remove active class on content area
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  //Active content area
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});

//Menu fade animation
const handleHover = function(e) {
  if(e.target.classList.contains('nav__link')) {
    console.log(this);
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if(el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
}

/*nav.addEventListener('mouseover', function(e) {
  handlerHover(e, 0.5);
});

nav.addEventListener('mouseout', function(e) {
  handlerHover(e, 1);
});*/

//Instead of the above code we can jus use bind to pass an 'argument' into a handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

//Sticky Navigation
const initialCoords = section1.getBoundingClientRect();

/*window.addEventListener('scroll', function(e) {
  console.log(window.scrollY);
  if(window.scrollY > initialCoords.top) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
})*/

//Implementing the sticky navigation with the Intersection Observer API
//the callback function will get called each time that the observed element is intersecting the root element at the threshold we defined. the function will get called with two parameters, the entires and observer object, entries are actually an array of the threshold entries since we can have multiple thresholds
const obsCallback = function(entries, observer){
  entries.forEach(entry => console.log(entry));
}

//root property is the element that the target is intersecting
//the threshold is a percentage of intersection at which the observer callback function is called
/*const obsOptions = {
  root: null,
  threshold: [0, 0.2],
}

const observer = new IntersectionObserver(obsCallback, obsOptions) ;

observer.observe(section1);*/

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function(entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}

const headerObserver = new IntersectionObserver
(stickyNav, {
  root: null, 
  threshold: 0,
  rootMargin: `-${navHeight}px`,//height of the navbar
});
headerObserver.observe(header);

//Reveal Sections
const revealSections = function(entries, observer) {
  const [entry] = entries;
  if(!entry.isIntersecting) return
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver
(revealSections, {root: null, threshold: 0.15});

allSections.forEach(function(section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
})

//Lazy Loading Images

const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function(entries, observer) {
  const [entry] = entries;
  console.log(entry);

  if(!entry.isIntersecting) return;
  //Replace src attr with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function() {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
}

const imgObserver = new IntersectionObserver
(loadImg, {root: null, threshold: 0, rootMargin: '-200px'});

imgTargets.forEach(img=> imgObserver.observe(img));

//Slider Component
const slider = function() {
const slides = document.querySelectorAll('.slide');

const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');

/*const slider = document.querySelector('.slider');
slider.style.transform = 'scale(0.5)';
slider.style.overflow = 'visible';*/

//slides.forEach((s, i) => (s.style.transform = `translateX(${100 * i}%)`));

//On btn right click we change the transform translate
const dotContainer = document.querySelector('.dots');

const createDots = function() {
  slides.forEach(function(_,i) {
    dotContainer.insertAdjacentHTML(
      'beforeend', `<button class="dots__dot" data-slide="${i}"></button>`);
  });
};

const activateDot = function(slide) {
  document
  .querySelectorAll('.dots__dot')
  .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
  .querySelector(`.dots__dot[data-slide="${slide}"]`)
  .classList.add('dots__dot--active');
};


const goToSlide = function(slide) {
  slides.forEach((s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`));
}


let currentSlide = 0;
const maxSlide = slides.length;

const nextSlide = function() {
  if(currentSlide === maxSlide -1) {
    currentSlide = 0;
  } else{
    //Next Slide
    currentSlide++;
  }

  goToSlide(currentSlide);
  activateDot(currentSlide);
}

const prevSlide = function() {
  
  if(currentSlide === 0) {
    currentSlide = maxSlide - 1
  }
  else{
      currentSlide--;
  }
  goToSlide(currentSlide);
  activateDot(currentSlide);
}


//Initalization Function
const init = function() {
  createDots();

  activateDot(0);

  goToSlide(0);
}

init();

//Event Handlers
btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function(e) {
  console.log(e);
  if(e.key === 'ArrowLeft') prevSlide();
  //short circuting
  e.key === 'ArrowRight' && nextSlide();

});

dotContainer.addEventListener('click', function(e) {
  if(e.target.classList.contains('dots__dot')) {
    //const {slide} = e.target.dataset;
    const slide = e.target.dataset.slide;
    goToSlide(slide);
    activateDot(slide);
  }
});
}

slider();
//tabs.forEach(t => t.addEventListener('click', () => console.log('TAB')));

//console.log(document.documentElement);
//console.log(document.head);
//console.log(document.body);

/*const message = document.createElement('div');
console.log(message);
message.classList.add('cookie-message');

message.innerHTML = 'We use cookies for improved functionality and analytics <button class="btn--close-cookie">Got it!</button>';


header.append(message);*/
//code below enables us to insert multiple copies of the same element by enabling us to clone the element, the true is passed into the cloneNode method to ensure that all the children will be copied too
//setTimeout(() => header.append(message.cloneNode(true)), 2000);
//document.querySelector('.btn--close-cookie').addEventListener('click', ()=> message.remove());

//console.log(getComputedStyle(message).color);
//console.log(getComputedStyle(message).width);
//message.style.height = Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

/*const h1 = document.querySelector('h1');
/*h1.addEventListener('mouseenter', function(e) {
  alert('Great');
})*/

/*
h1.onmouseenter = function(e) {
  console.log('Mouse enter occured');
}

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () => `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

console.log(randomColor);*/


/*document.querySelector('.nav__link').addEventListener('click', function(e) {
  this.style.backgroundColor = randomColor();
  console.log('Link', e.target, e.currentTarget);
  console.log(e.currentTarget === this);
  e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function(e) {
  this.style.backgroundColor = randomColor();
  console.log('Container', e.target, e.currentTarget);
});

//setting the event to true means you are capturing the event in the capture phase
document.querySelector('.nav').addEventListener('click', function(e) {
  this.style.backgroundColor = randomColor();
  console.log('Nav', e.target, e.currentTarget);
}, false);*/