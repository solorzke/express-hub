export const Months = [
	{ name: 'January', value: '01' },
	{ name: 'February', value: '02' },
	{ name: 'March', value: '03' },
	{ name: 'April', value: '04' },
	{ name: 'May', value: '05' },
	{ name: 'June', value: '06' },
	{ name: 'July', value: '07' },
	{ name: 'August', value: '08' },
	{ name: 'September', value: '09' },
	{ name: 'October', value: '10' },
	{ name: 'November', value: '11' },
	{ name: 'December', value: '12' }
];

const getDays = () => {
	let days = [];
	for (let i = 1; i <= 31; i++) {
		const dayFormat = i.toString().length === 1 ? `0${i}` : `${i}`;
		days.push(dayFormat);
	}
	return days;
};

const getYears = () => {
	const currentYear = new Date().getFullYear();
	const years = [];
	for (let i = currentYear; i >= 2020; i--) {
		years.push(i);
	}
	return years;
};

export const Years = getYears();

export const Days = getDays();
