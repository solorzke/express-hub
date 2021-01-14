import React, { useState } from 'react';
import Drawer from '../Drawer/Drawer';
import './Wrapper.css';

const Wrapper = ({ children, current }) => {
	const Wrap = () => {
		const [ toggle, setToggle ] = useState('');

		const onClick = (event) => {
			event.preventDefault();
			toggle === ' toggled' ? setToggle('') : setToggle(' toggled');
		};

		return (
			<div className={`d-flex${toggle}`} id="wrapper">
				<Drawer />
				<div id="page-content-wrapper">
					<nav className="navbar navbar-expand-lg navbar-light bg-light text-light border-bottom bg-nav">
						<button className="btn" id="menu-toggle" onClick={(event) => onClick(event)}>
							<i className="fas fa-bars bars" />
						</button>
						{current}
					</nav>
					{children}
				</div>
			</div>
		);
	};
	return <Wrap />;
};

export default Wrapper;
