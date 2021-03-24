import React from 'react';
import './Button.css';

const Button = ({ label }) => {
	return (
		<button id="btn" className="slide_from_left">
			{label}
		</button>
	);
};

export default Button;
