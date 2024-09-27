function createCarCards(carsArr, carsContainer) {
  let fragment = document.createDocumentFragment();

  carsArr.forEach((car) => {
    let element = document.createElement("div");
    element.classList.add("cars__item", car.itemClass);

    let template = `
					<div class="cars__item-slider">
							<div class="swiper ${car.swiperClass}">
									<div class="swiper-wrapper">
											${car.images
                        .map(
                          (image) => `
													<div class="swiper-slide">
															${
                                image.type === "video"
                                  ? `<video autoplay muted><source src="${image.src}" type="video/mp4"></video>`
                                  : `<img src="${image.src}" alt="${car.model}"/>`
                              }
													</div>
											`
                        )
                        .join("")}
									</div>
									<div class="swiper-button-next swiper-button"></div>
									<div class="swiper-button-prev swiper-button"></div>
							</div>
							<div thumbsSlider="" class="swiper ${car.thumbSwiperClass}">
									<div class="swiper-wrapper thumb-slide">
											${car.thumbs
                        .map(
                          (thumb) => `
													<div class="swiper-slide thumb-slide-item">
															${
                                thumb.type === "video"
                                  ? `<video src="${thumb.src}"></video>`
                                  : `<img src="${thumb.src}" alt="${car.model}"/>`
                              }
													</div>
											`
                        )
                        .join("")}
									</div>
							</div>
					</div>
					<div class="cars__content">
							<div class="cars__content-title"> 
									<h4 class="h4">${car.model}</h4>
									<div class="cars__content-pricing">
											<div class="cars__content-pricing-item">
													<img src="./img/icons/dollar.svg" alt="Dollar Sign"> 
													<span class="text">${car.price} $/hour</span>
											</div>
											<div class="cars__content-pricing-item">
													<img src="./img/icons/user.svg" alt="User Sign"> 
													<span class="text">${car.capacity}</span>
											</div>
											<div class="cars__content-pricing-item">
													<img src="./img/icons/backpack.svg" alt="Backpack Sign"> 
													<span class="text">${car.cargoSpace} ft³</span>
											</div>
									</div>
							</div> 
							<div class="cars__content-item">
									<div class="cars__content-description">
											<p>${car.description}</p>
									</div>
							</div>
							<div>
									 <a href="./book.html" class="book__button cars__book__button text">Check Availability</a>
							</div>
					</div>
			`;

    element.innerHTML = template;
    fragment.appendChild(element);
  });

  carsContainer.appendChild(fragment);
}
const carsData = [
  {
    itemClass: "cars__item-2",
    swiperClass: "cars__item-swiper cars__item-swiper-1",
    thumbSwiperClass: "thumb-slider thumb-slider-1",
    model: "2023 Chevrolet Tahoe",
    price: 200,
    capacity: 8,
    cargoSpace: "25.5—122.9",
    description:
      "The 2023 Chevrolet Tahoe offers a spacious and comfortable ride for up to eight passengers. With plenty of legroom in both the second and third rows, every passenger can enjoy a relaxed journey. The available rear-seat entertainment system ensures that everyone stays entertained on long trips, while the standard tri-zone automatic climate control keeps the cabin at the perfect temperature for all.",
    images: [
      { type: "image", src: "./img/cars/tahoe/01.webp" },
      { type: "image", src: "./img/cars/tahoe/02.webp" },
      { type: "image", src: "./img/cars/tahoe/03.webp" },
      { type: "image", src: "./img/cars/tahoe/04.webp" },
      { type: "image", src: "./img/cars/tahoe/05.webp" },
      { type: "image", src: "./img/cars/tahoe/06.webp" },
      { type: "image", src: "./img/cars/tahoe/07.webp" },
    ],
    thumbs: [
      { type: "image", src: "./img/cars/tahoe/01.webp" },
      { type: "image", src: "./img/cars/tahoe/02.webp" },
      { type: "image", src: "./img/cars/tahoe/03.webp" },
      { type: "image", src: "./img/cars/tahoe/04.webp" },
      { type: "image", src: "./img/cars/tahoe/05.webp" },
      { type: "image", src: "./img/cars/tahoe/06.webp" },
      { type: "image", src: "./img/cars/tahoe/07.webp" },
    ],
  },
  {
    itemClass: "cars__item-3",
    swiperClass: "cars__item-swiper cars__item-swiper-2",
    thumbSwiperClass: "thumb-slider thumb-slider-2",
    model: "2024 Infiniti QX60",
    price: 160,
    capacity: 7,
    cargoSpace: "14.5—75.4",
    description:
      "The 2024 Infiniti QX60 is designed with passenger comfort in mind. Its leather-appointed seating and tri-zone automatic climate control create a luxurious atmosphere for all occupants. The second-row passengers will appreciate the available captain’s chairs, providing them with extra space and comfort, while the panoramic sunroof offers breathtaking views and a bright, airy feel.",
    images: [
      { type: "image", src: "./img/cars/qx/01.webp" },
      { type: "image", src: "./img/cars/qx/02.webp" },
      { type: "image", src: "./img/cars/qx/03.webp" },
      { type: "image", src: "./img/cars/qx/04.webp" },
      { type: "image", src: "./img/cars/qx/05.webp" },
      { type: "image", src: "./img/cars/qx/06.webp" },
      { type: "image", src: "./img/cars/qx/07.webp" },
    ],
    thumbs: [
      { type: "image", src: "./img/cars/qx/01.webp" },
      { type: "image", src: "./img/cars/qx/02.webp" },
      { type: "image", src: "./img/cars/qx/03.webp" },
      { type: "image", src: "./img/cars/qx/04.webp" },
      { type: "image", src: "./img/cars/qx/05.webp" },
      { type: "image", src: "./img/cars/qx/06.webp" },
      { type: "image", src: "./img/cars/qx/07.webp" },
    ],
  },
  {
    itemClass: "cars__item-2",
    swiperClass: "cars__item-swiper cars__item-swiper-3",
    thumbSwiperClass: "thumb-slider thumb-slider-3",
    model: "2023 Tesla Model 3",
    price: 160,
    capacity: 5,
    cargoSpace: "15—30",
    description:
      "The 2023 Tesla Model 3 offers an ultra-quiet ride, allowing passengers to enjoy conversations and entertainment without the usual road noise. With its minimalist interior design and large touchscreen display, every journey feels futuristic. Rear passengers benefit from generous legroom and a flat floor, making the back seat comfortable even on longer trips.",
    images: [
      { type: "image", src: "./img/cars/tesla/01.webp" },
      { type: "image", src: "./img/cars/tesla/02.webp" },
      { type: "image", src: "./img/cars/tesla/03.webp" },
      { type: "image", src: "./img/cars/tesla/04.webp" },
      { type: "image", src: "./img/cars/tesla/05.webp" },
      { type: "image", src: "./img/cars/tesla/06.webp" },
    ],
    thumbs: [
      { type: "image", src: "./img/cars/tesla/01.webp" },
      { type: "image", src: "./img/cars/tesla/02.webp" },
      { type: "image", src: "./img/cars/tesla/03.webp" },
      { type: "image", src: "./img/cars/tesla/04.webp" },
      { type: "image", src: "./img/cars/tesla/05.webp" },
      { type: "image", src: "./img/cars/tesla/06.webp" },
    ],
  },
  {
    itemClass: "cars__item-3",
    swiperClass: "cars__item-swiper cars__item-swiper-4",
    thumbSwiperClass: "thumb-slider thumb-slider-4",
    model: "2024 Chevrolet Suburban",
    price: 200,
    capacity: 8,
    cargoSpace: "41.5—144.7",
    description:
      "The 2024 Chevrolet Suburban is a perfect choice for large families or groups, offering seating for up to eight passengers. The roomy interior ensures that everyone has plenty of space to stretch out, and the available rear-seat entertainment system keeps passengers entertained on long drives. The premium Bose sound system envelops the cabin with high-quality audio, making every journey enjoyable.",
    images: [
      { type: "image", src: "./img/cars/suburban/01.webp" },
      { type: "image", src: "./img/cars/suburban/02.webp" },
      { type: "image", src: "./img/cars/suburban/03.webp" },
      { type: "image", src: "./img/cars/suburban/04.webp" },
      { type: "image", src: "./img/cars/suburban/05.webp" },
      { type: "image", src: "./img/cars/suburban/06.webp" },
      { type: "image", src: "./img/cars/suburban/07.webp" },
    ],
    thumbs: [
      { type: "image", src: "./img/cars/suburban/01.webp" },
      { type: "image", src: "./img/cars/suburban/02.webp" },
      { type: "image", src: "./img/cars/suburban/03.webp" },
      { type: "image", src: "./img/cars/suburban/04.webp" },
      { type: "image", src: "./img/cars/suburban/05.webp" },
      { type: "image", src: "./img/cars/suburban/06.webp" },
      { type: "image", src: "./img/cars/suburban/07.webp" },
    ],
  },
];

const carsContainer = document.getElementById("cars__container");
createCarCards(carsData, carsContainer);
