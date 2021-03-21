export const InputTypes = (state) => [
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
