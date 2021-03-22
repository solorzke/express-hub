export const OrderTypes = (state) => {
	const item_names = state.items.map((item) => item.name).join(', ');
	const status = state.shippingStatus ? 'Enviado' : 'Esperando ser enviado';

	return [
		{
			name: 'Número de Orden',
			img: 'fas fa-barcode',
			value: state.orderId,
			type: 'text',
			key: 'orderId',
			permitted: false
		},
		{
			name: 'Numero de Cliente',
			img: 'fas fa-id-badge',
			value: state.clientId,
			type: 'text',
			key: 'clientId',
			permitted: false
		},
		{
			name: 'El Número de Rastreo',
			img: 'fas fa-truck',
			value: state.trackingNum,
			type: 'text',
			key: 'trackingNum',
			permitted: true
		},
		{
			name: 'Estado Del Envío',
			img: 'fas fa-passport',
			value: status,
			type: 'toggle',
			key: 'shippingStatus',
			permitted: true,
			status: state.shippingStatus
		},
		{ name: 'Fecha', img: 'fas fa-calendar-day', value: state.date, type: 'date', key: 'date', permitted: true },
		{ name: 'Artículos', img: 'fas fa-box-open', value: item_names, type: 'none', permitted: false },
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
		},
		{
			name: 'Notas',
			img: 'fas fa-sticky-note',
			value: state.notes,
			type: 'rich-text',
			key: 'notes',
			permitted: true
		}
	];
};

export const ClientTypes = (state) => [
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

export const UserTypes = (state) => [
	{
		name: 'Usuario Id',
		img: 'fas fa-passport',
		value: state.emp_id,
		type: 'text',
		key: 'emp_id',
		permitted: false
	},

	{
		name: 'Primero Name',
		img: 'fas fa-id-card',
		value: state.fname,
		type: 'text',
		key: 'fname',
		permitted: true
	},

	{
		name: 'Apellido',
		img: 'fas fa-id-card',
		value: state.lname,
		type: 'text',
		key: 'lname',
		permitted: true
	},

	{
		name: 'Dirección de Correo Electrónico',
		img: 'fas fa-at',
		value: state.email,
		type: 'user-email',
		key: 'email',
		permitted: true
	},

	{
		name: 'Contraseña',
		img: 'fas fa-lock',
		value: '**********',
		type: 'password',
		key: 'countersign',
		permitted: true
	}
];

export const QuoteTypes = (state) => [
	{
		name: 'Cliente Id',
		img: 'fas fa-user pr-1',
		value: state.client,
		type: 'text',
		key: 'client',
		permitted: false
	},

	{
		name: 'Cotizacion Id',
		img: 'fas fa-quote-right pr-1',
		value: state.uid,
		type: 'text',
		key: 'uid',
		permitted: false
	},

	{
		name: 'Artículo',
		img: 'fas fa-box-open pr-1',
		value: state.item,
		type: 'text',
		key: 'item',
		permitted: true
	},

	{
		name: 'Fecha',
		img: 'fas fa-calendar-alt pr-1',
		value: state.date,
		type: 'date',
		key: 'date',
		permitted: false
	},

	{
		name: 'Precio Cotizado',
		img: 'fas fa-tag pr-1',
		value: state['quoted-price'],
		type: 'price',
		key: 'quoted-price',
		permitted: true
	},

	{
		name: 'Costo',
		img: 'fas fa-dollar-sign pr-1',
		value: state.cost,
		type: 'price',
		key: 'cost',
		permitted: true
	},

	{
		name: 'Notas',
		img: 'fas fa-sticky-note pr-1',
		value: state.notes,
		type: 'rich-text',
		key: 'notes',
		permitted: true
	}
];
