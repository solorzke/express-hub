export const Headings = (onClick) => [
	{
		name: 'Pedido Id',
		style: { cursor: 'pointer' },
		class: {
			asc: 'fas fa-sort-up float-right',
			des: 'fas fa-sort-down float-right',
			none: 'fas fa-sort float-right'
		},
		onClick: () => onClick('num', 'orderId')
	},

	{
		name: 'Cliente Id',
		style: { cursor: 'pointer' },
		class: {
			asc: 'fas fa-sort-up float-right',
			des: 'fas fa-sort-down float-right',
			none: 'fas fa-sort float-right'
		},
		onClick: () => onClick('num', 'clientId')
	},

	{
		name: 'Fecha',
		style: { cursor: 'pointer' },
		class: {
			asc: 'fas fa-sort-up float-right',
			des: 'fas fa-sort-down float-right',
			none: 'fas fa-sort float-right'
		},
		onClick: () => onClick('date', 'date')
	},

	{
		name: 'País',
		style: { cursor: 'pointer' },
		class: {
			asc: 'fas fa-sort-up float-right',
			des: 'fas fa-sort-down float-right',
			none: 'fas fa-sort float-right'
		},
		onClick: () => onClick('string', 'country')
	},

	{
		name: 'Provincia',
		style: { cursor: 'pointer' },
		class: {
			asc: 'fas fa-sort-up float-right',
			des: 'fas fa-sort-down float-right',
			none: 'fas fa-sort float-right'
		},
		onClick: () => onClick('string', 'province')
	},

	{
		name: 'Dirección',
		style: { cursor: 'pointer' },
		class: {
			asc: 'fas fa-sort-up float-right',
			des: 'fas fa-sort-down float-right',
			none: 'fas fa-sort float-right'
		},
		onClick: () => onClick('string', 'address')
	},

	{
		name: 'Estado Del Envío',
		style: { cursor: 'pointer' },
		class: {
			asc: 'fas fa-sort-up float-right',
			des: 'fas fa-sort-down float-right',
			none: 'fas fa-sort float-right'
		},
		onClick: () => onClick('boolean', 'shippingStatus')
	},

	{
		name: 'El Número De Rastreo',
		style: { cursor: 'pointer' },
		class: {
			asc: 'fas fa-sort-up float-right',
			des: 'fas fa-sort-down float-right',
			none: 'fas fa-sort float-right'
		},
		onClick: () => onClick('string', 'trackingNum')
	}
];
