export const fieldTypes = (state) => [
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
