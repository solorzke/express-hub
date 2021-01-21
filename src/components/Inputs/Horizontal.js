import React from 'react';

const Input = ({ label, type, id, placeholder, name, }) => {
	return (
		<>
			<label htmlFor={id} className="col-sm-2 col-form-label">
				{label}
			</label>
			<div className="col-sm-10">
				<input type={type} className="form-control" id={id} placeholder={placeholder} name={name} />
			</div>
		</>
	);
};

export default Input;
