import React from 'react';

const Input = ({ refs, column, label, type, id, placeholder, name, required = true }) => {
	return (
		<div className={`form-group ${column}`}>
			<label htmlFor={id}>{label}</label>
			<input
				ref={refs}
				required={required}
				type={type}
				className="form-control"
				id={id}
				placeholder={placeholder}
				name={name}
			/>
		</div>
	);
};

export default Input;
