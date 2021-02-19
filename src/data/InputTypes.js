export const fieldTypes = (state) => {
	const item_names = state.items.map((item) => item.name).join(', ');
	const status = state.shippingStatus ? 'Shipped' : 'Waiting to be shipped';

	return [
		{
			name: 'Order Number',
			img: 'fas fa-barcode',
			value: state.orderId,
			type: 'text',
			key: 'orderId',
			permitted: false
		},
		{
			name: 'Client Number',
			img: 'fas fa-id-badge',
			value: state.clientId,
			type: 'text',
			key: 'clientId',
			permitted: false
		},
		{
			name: 'Tracking Number',
			img: 'fas fa-truck',
			value: state.trackingNum,
			type: 'text',
			key: 'trackingNum',
			permitted: true
		},
		{
			name: 'Shipment Status',
			img: 'fas fa-passport',
			value: status,
			type: 'toggle',
			key: 'shippingStatus',
			permitted: true,
			status: state.shippingStatus
		},
		{ name: 'Date', img: 'fas fa-calendar-day', value: state.date, type: 'date', key: 'date', permitted: true },
		{ name: 'Items', img: 'fas fa-box-open', value: item_names, type: 'none', permitted: false },
		{
			name: 'Country',
			img: 'fas fa-globe-americas pr-1',
			value: state.country,
			type: 'text',
			key: 'country',
			permitted: true
		},
		{
			name: 'Province',
			img: 'fas fa-city pr-1',
			value: state.province,
			type: 'text',
			key: 'province',
			permitted: true
		},
		{
			name: 'Address',
			img: 'far fa-address-card pr-1',
			value: state.address,
			type: 'text',
			key: 'address',
			permitted: true
		},
		{
			name: 'Notes',
			img: 'fas fa-sticky-note',
			value: state.notes,
			type: 'rich-text',
			key: 'notes',
			permitted: true
		}
	];
};
