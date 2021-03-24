import React from 'react';
import './Footer.css';
import Copyright from './Copyright';
import Navigation from './Navigation';

const Footer = () => {
	return (
		<div className="footer-container">
			<Navigation />
			<Copyright year={new Date().getFullYear()} />
		</div>
	);
};

export default Footer;
