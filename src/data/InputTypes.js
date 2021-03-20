export const fieldTypes = (state) => {
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
