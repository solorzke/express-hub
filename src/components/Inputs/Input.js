import React from 'react';

const Input = ({ column, label, type, id, placeholder, name }) => {
	return (
		<div className={`form-group ${column}`}>
			<label htmlFor={id}>{label}</label>
			<input required type={type} className="form-control" id={id} placeholder={placeholder} name={name} />
		</div>
	);
};

export default Input;
