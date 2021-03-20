export const Months = [
	{ name: 'Enero', value: '01' },
	{ name: 'Febrero', value: '02' },
	{ name: 'Marzo', value: '03' },
	{ name: 'Abril', value: '04' },
	{ name: 'Mayo', value: '05' },
	{ name: 'Junio', value: '06' },
	{ name: 'Julio', value: '07' },
	{ name: 'Agosto', value: '08' },
	{ name: 'Septiembre', value: '09' },
	{ name: 'Octubre', value: '10' },
	{ name: 'Noviembre', value: '11' },
	{ name: 'Diciembre', value: '12' }
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
