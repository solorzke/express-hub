export const Headings = (onClick) => [
	{
		name: 'Order Id',
		style: { cursor: 'pointer' },
		class: {
			asc: 'fas fa-sort-up float-right',
			des: 'fas fa-sort-down float-right',
			none: 'fas fa-sort float-right'
		},
		onClick: () => onClick('num', 'orderId')
	},

	{
		name: 'Client Id',
		style: { cursor: 'pointer' },
		class: {
			asc: 'fas fa-sort-up float-right',
			des: 'fas fa-sort-down float-right',
			none: 'fas fa-sort float-right'
		},
		onClick: () => onClick('num', 'clientId')
	},

	{
		name: 'Date',
		style: { cursor: 'pointer' },
		class: {
			asc: 'fas fa-sort-up float-right',
			des: 'fas fa-sort-down float-right',
			none: 'fas fa-sort float-right'
		},
		onClick: () => onClick('date', 'date')
	},

	{
		name: 'Country',
		style: { cursor: 'pointer' },
		class: {
			asc: 'fas fa-sort-up float-right',
			des: 'fas fa-sort-down float-right',
			none: 'fas fa-sort float-right'
		},
		onClick: () => onClick('string', 'country')
	},

	{
		name: 'Province',
		style: { cursor: 'pointer' },
		class: {
			asc: 'fas fa-sort-up float-right',
			des: 'fas fa-sort-down float-right',
			none: 'fas fa-sort float-right'
		},
		onClick: () => onClick('string', 'province')
	},

	{
		name: 'Address',
		style: { cursor: 'pointer' },
		class: {
			asc: 'fas fa-sort-up float-right',
			des: 'fas fa-sort-down float-right',
			none: 'fas fa-sort float-right'
		},
		onClick: () => onClick('string', 'address')
	},

	{
		name: 'Shipping Status',
		style: { cursor: 'pointer' },
		class: {
			asc: 'fas fa-sort-up float-right',
			des: 'fas fa-sort-down float-right',
			none: 'fas fa-sort float-right'
		},
		onClick: () => onClick('boolean', 'shippingStatus')
	},

	{
		name: 'Tracking Number',
		style: { cursor: 'pointer' },
		class: {
			asc: 'fas fa-sort-up float-right',
			des: 'fas fa-sort-down float-right',
			none: 'fas fa-sort float-right'
		},
		onClick: () => onClick('string', 'trackingNum')
	}
];
