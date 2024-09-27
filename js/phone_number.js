// Функция для очистки номера телефона от форматирования
function cleanPhoneNumber(phoneNumber) {
	return phoneNumber.replace(/[^0-9]/g, '');
}

// Функция для установки номера телефона
function setPhoneNumber() {
	// Получаем текущее время
	const now = new Date();
	const currentHour = now.getUTCHours(); // Час по UTC
	const denverOffset = -6; // Денвер находится в UTC-6
	const denverHour = (currentHour + denverOffset + 24) % 24; // Переводим час на время Денвера

	// Устанавливаем номера телефонов
	const dayPhoneNumber = "+1 (720) 780-3033"; // Дневной номер телефона
	const nightPhoneNumber = "+1 (720) 579-1938"; // Ночной номер телефона

	// Определяем текущий номер телефона в зависимости от времени
	const phoneNumber = (denverHour >= 17 || denverHour < 8) ? nightPhoneNumber : dayPhoneNumber;
	const cleanedPhoneNumber = cleanPhoneNumber(phoneNumber);

	// Обновляем элементы с классом phone__href
	const phoneHrefElements = document.querySelectorAll('.phone__href');
	phoneHrefElements.forEach(element => {
			element.setAttribute('href', 'tel:' + cleanedPhoneNumber);
	});

	// Обновляем элементы с классом phone__text
	const phoneTextElements = document.querySelectorAll('.phone__text');
	phoneTextElements.forEach(element => {
			element.textContent = phoneNumber;
	});
}

// Вызываем функцию после загрузки страницы
document.addEventListener('DOMContentLoaded', setPhoneNumber);
