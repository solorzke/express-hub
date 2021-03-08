export const fieldTypes = (state) => [
	{
		name: 'User Id',
		img: 'fas fa-passport',
		value: state.emp_id,
		type: 'text',
		key: 'emp_id',
		permitted: false
	},

	{
		name: 'First Name',
		img: 'fas fa-id-card',
		value: state.fname,
		type: 'text',
		key: 'fname',
		permitted: true
	},

	{
		name: 'Last Name',
		img: 'fas fa-id-card',
		value: state.lname,
		type: 'text',
		key: 'lname',
		permitted: true
	},

	{
		name: 'Email Address',
		img: 'fas fa-at',
		value: state.email,
		type: 'user-email',
		key: 'email',
		permitted: true
	},

	{
		name: 'Password',
		img: 'fas fa-lock',
		value: '**********',
		type: 'password',
		key: 'countersign',
		permitted: true
	}
];
