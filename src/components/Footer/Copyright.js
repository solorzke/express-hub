import React from 'react';
import './Footer.css';

const Copyright = () => (
	<div className="copyright-container px-3">
		<p>
			&copy; {new Date().getFullYear()} Teloentrego LLC All rights reserved
			<span style={{ paddingLeft: 10, paddingRight: 10 }}>
				<a href="#">Terms &amp; Conditions</a>
			</span>
			<span>
				<a href="#">Privacy Policy</a>
			</span>
			<span className="pl-2">
				<a href="https://www.solorzke.com/" target="_blank">
					Designed By Solorzke Designs
				</a>
			</span>
		</p>
	</div>
);

export default Copyright;
