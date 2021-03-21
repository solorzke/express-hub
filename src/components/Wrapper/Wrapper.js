import React, { useState } from 'react';
import Drawer from '../Drawer/Drawer';
import './Wrapper.css';

const Wrapper = ({ children, current, active }) => {
	const Wrap = () => {
		const [ toggle, setToggle ] = useState('');

		const onClick = (event) => {
			event.preventDefault();
			toggle === ' toggled' ? setToggle('') : setToggle(' toggled');
		};

		return (
			<div className={`d-flex${toggle}`} id="wrapper">
				<Drawer active={active} />
				<div id="page-content-wrapper">
					<nav
						className="navbar navbar-expand-lg navbar-light bg-light border-bottom bg-nav"
						style={{ color: '#FFDDA1' }}
					>
						<span>
							<button className="btn" id="menu-toggle" onClick={(event) => onClick(event)}>
								<i className="fas fa-bars bars" />
							</button>
							{current}
						</span>
					</nav>
					{children}
				</div>
			</div>
		);
	};
	return <Wrap />;
};

export default Wrapper;
