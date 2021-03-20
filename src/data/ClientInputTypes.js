export const fieldTypes = (state) => [
	{
		name: 'Primero Nombre',
		img: 'fas fa-signature pr-1',
		value: state.fname,
		type: 'text',
		key: 'fname',
		permitted: true
	},

	{
		name: 'Apellido',
		img: 'fas fa-signature pr-1',
		value: state.lname,
		type: 'text',
		key: 'lname',
		permitted: true
	},

	{
		name: 'Género',
		img: 'fas fa-venus-mars pr-1',
		value: state.gender,
		type: 'radio',
		key: 'gender',
		permitted: true,
		options: [
			{ value: 'male', name: 'Male' },
			{ value: 'female', name: 'Female' },
			{ value: 'other', name: 'Other' }
		]
	},

	{
		name: 'Dirección De Correo Electrónico',
		img: 'fas fa-at pr-1',
		value: state.email,
		type: 'client-email',
		key: 'email',
		permitted: true
	},

	{
		name: 'Número De Teléfono',
		img: 'fas fa-phone pr-1',
		value: state.phone,
		type: 'tel',
		key: 'phone',
		permitted: true
	},

	{
		name: 'País',
		img: 'fas fa-globe-americas pr-1',
		value: state.country,
		type: 'text',
		key: 'country',
		permitted: true
	},

	{
		name: 'Provincia',
		img: 'fas fa-city pr-1',
		value: state.province,
		type: 'text',
		key: 'province',
		permitted: true
	},

	{
		name: 'Dirección',
		img: 'far fa-address-card pr-1',
		value: state.address,
		type: 'text',
		key: 'address',
		permitted: true
	}
];
