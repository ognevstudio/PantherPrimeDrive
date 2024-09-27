// Function to toggle the mobile menu
function toggleMenu() {
	const menuBackground = document.getElementById("menuBackground");
	const menuContent = document.getElementById("menuContent");
	const menuIcon = document.getElementById("menuIcon");

	// Check if the menu is currently open
	const isMenuOpen = menuBackground.style.display === "block";

	// Toggle the display of menu elements based on the current state
	menuBackground.style.display = isMenuOpen ? "none" : "block";
	menuContent.style.display = isMenuOpen ? "none" : "block";
	menuIcon.classList.toggle("header__mobile-close");
}

document.addEventListener("DOMContentLoaded", () => {
  const initReviewsSlider = (sliderContainer) => {
    let slideIndex = 0;
    const slides = sliderContainer.querySelectorAll('.slider-item');
    const slider = sliderContainer.querySelector('.slider');
    const parentSection = sliderContainer.closest('section');
    const prevButton = parentSection.querySelector('.navigation__prev');
    const nextButton = parentSection.querySelector('.navigation__next');

    // Ensure elements are valid before using them
    if (!slider || !prevButton || !nextButton) {
      console.error('Slider or navigation buttons not found');
      return;
    }

    const slideWidth = 320; // Predefined width of each slide in reviews section
    const slideGap = 20; // Gap between slides

    const calculateOffset = (index) => {
      const totalWidth = slides.length * (slideWidth + slideGap) - slideGap; // Total width of all slides minus the last gap
      const containerWidth = sliderContainer.offsetWidth;
      const maxOffset = totalWidth - containerWidth;

      let offset = index * (slideWidth + slideGap);
      if (offset > maxOffset) {
        offset = maxOffset;
      }
      return offset;
    };

    const showSlides = (index) => {
      const maxIndex = Math.max(0, slides.length - Math.floor(sliderContainer.offsetWidth / (slideWidth + slideGap)));
      slideIndex = index < 0 ? maxIndex : index > maxIndex ? 0 : index;

      const offset = calculateOffset(slideIndex);
      slider.style.transform = `translateX(-${offset}px)`;

      updateButtonStyles();
    };

    nextButton.addEventListener('click', () => {
      slideIndex = (slideIndex + 1) % slides.length;
      showSlides(slideIndex);
    });

    prevButton.addEventListener('click', () => {
      slideIndex = (slideIndex - 1 + slides.length) % slides.length;
      showSlides(slideIndex);
    });

    const updateButtonStyles = () => {
      if (slideIndex === 0 && window.innerWidth >= 720) {
        prevButton.style.backgroundColor = 'gray';
        prevButton.style.cursor = 'not-allowed';
      } else {
        prevButton.style.backgroundColor = '';
      }
    };

    showSlides(slideIndex);

    window.addEventListener('resize', () => {
      showSlides(slideIndex);
    });
  };

	const initVideoControls = (container) => {
    const videos = container.querySelectorAll('.video');
    videos.forEach(video => {
        const playButton = container.querySelector(`.play-button[data-video-id="${video.dataset.videoId}"]`);

        const togglePlayPause = () => {
            const isPaused = video.paused;
            video[isPaused ? 'play' : 'pause']();
            playButton.style.display = isPaused ? 'none' : 'block';
        };

        [playButton, video].forEach(el => el.addEventListener('click', togglePlayPause));
        video.addEventListener('ended', () => playButton.style.display = 'block');
    });
};

  // Initialize sliders and video controls for the reviews section
  document.querySelectorAll('#reviews .slider-container').forEach(container => {
    initReviewsSlider(container);
    initVideoControls(container);
  });

  // Initialize sliders and video controls for the reviews section
  document.querySelectorAll('#drivers .slider-container').forEach(container => {
    initReviewsSlider(container);
    initVideoControls(container);
  });

  // Accordion functionality
  const accordionButtons = document.getElementsByClassName("accordion__button");

  const closeAllPanels = () => {
    const allPanels = document.getElementsByClassName("accordion__text");
    Array.from(allPanels).forEach(panel => {
      panel.style.maxHeight = null;
      panel.classList.remove("open");
      panel.previousElementSibling.classList.remove("active");
    });
  };

  const togglePanel = (panel, button) => {
    const isOpen = panel.style.maxHeight;
    if (isOpen) {
      panel.style.maxHeight = null;
      panel.classList.remove("open");
      button.classList.remove("active");
    } else {
      closeAllPanels();
      panel.style.maxHeight = `${panel.scrollHeight + 20}px`;
      panel.classList.add("open");
      button.classList.add("active");
    }
  };

  Array.from(accordionButtons).forEach(button => {
    button.addEventListener("click", () => {
      const panel = button.nextElementSibling;
      togglePanel(panel, button);
    });
  });

  // Initialize Swiper instances
  const swiper1 = new Swiper('.cars__item-swiper-1', {
    loop: true,
    spaceBetween: 10,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    thumbs: {
      swiper: {
        el: '.thumb-slider-1',
        slidesPerView: 5,
      },
    },
  });

  const swiper2 = new Swiper('.cars__item-swiper-2', {
    loop: true,
    spaceBetween: 10,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    thumbs: {
      swiper: {
        el: '.thumb-slider-2',
        slidesPerView: 5,
      },
    },
  });

  const swiper3 = new Swiper('.cars__item-swiper-3', {
    loop: true,
    spaceBetween: 10,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    thumbs: {
      swiper: {
        el: '.thumb-slider-3',
        slidesPerView: 5,
      },
    },
  });

  const swiper4 = new Swiper('.cars__item-swiper-4', {
    loop: true,
    spaceBetween: 10,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    thumbs: {
      swiper: {
        el: '.thumb-slider-4',
        slidesPerView: 5,
      },
    },
  });

  let swiperInstance = null; // Define swiperInstance here

  function initializeSwiper() {
    if (swiperInstance === null && window.innerWidth <= 800 && window.innerWidth > 510) {
      swiperInstance = new Swiper(".cars-swiper", {
        slidesPerView: 1.4,
        spaceBetween: 20,
        navigation: {
          nextEl: '.swiper-button-next-1',
          prevEl: '.swiper-button-prev-1',
        },
        on: {
          init: updateNavigationButtons,
          slideChange: updateNavigationButtons,
        }
      });
    } else if (swiperInstance === null && window.innerWidth <= 510) {
      swiperInstance = new Swiper(".cars-swiper", {
        slidesPerView: 1,
        spaceBetween: 20,
        navigation: {
          nextEl: '.swiper-button-next-1',
          prevEl: '.swiper-button-prev-1',
        },
        on: {
          init: updateNavigationButtons,
          slideChange: updateNavigationButtons,
        }
      });
    }
  }

  function updateNavigationButtons() {
    const nextButton = document.querySelector('.swiper-button-next-1');
    const prevButton = document.querySelector('.swiper-button-prev-1');

    if (swiperInstance) {
      if (swiperInstance.isEnd) {
        nextButton.disabled = true;
      } else {
        nextButton.disabled = false;
      }

      if (swiperInstance.isBeginning) {
        prevButton.disabled = true;
      } else {
        prevButton.disabled = false;
      }
    }
  }

  window.addEventListener('resize', () => {
    if (swiperInstance) {
      swiperInstance.destroy();
      swiperInstance = null;
    }
    initializeSwiper();
  });

  window.addEventListener('load', initializeSwiper);

  function destroySwiper() {
    if (swiperInstance !== null && window.innerWidth > 800) {
      swiperInstance.destroy(true, true);
      swiperInstance = null;
    }
  }

  function addSwiperClasses() {
    const carsAb = document.getElementById('cars-swiper');
    const carsContainer = document.getElementById('cars__container');

    if (window.innerWidth <= 800) {
      if (carsAb) {
        carsAb.classList.add('swiper', 'cars__swiper');
      }

      if (carsContainer) {
        carsContainer.classList.add('swiper-wrapper', 'cars__swiper-wrapper');
        carsContainer.querySelectorAll('.cars__item').forEach(slide => {
          slide.classList.add('swiper-slide');
        });
      }

      initializeSwiper();
    } else {
      destroySwiper();
      if (carsAb) {
        carsAb.classList.remove('swiper', 'cars__swiper');
      }
      if (carsContainer) {
        carsContainer.classList.remove('swiper-wrapper', 'cars__swiper-wrapper');
        carsContainer.querySelectorAll('.cars__item').forEach(slide => {
          slide.classList.remove('swiper-slide');
        });
      }
    }
  }

  addSwiperClasses(); // Initial check
  window.addEventListener('resize', addSwiperClasses);

  const marqueeInner = document.querySelector('.home__marquee-inner');
  if (marqueeInner) {
    const marqueeItems = marqueeInner.innerHTML;

    // Repeat content to fill the screen width and ensure seamless scrolling
    marqueeInner.innerHTML += marqueeItems + marqueeItems;
  }
});
