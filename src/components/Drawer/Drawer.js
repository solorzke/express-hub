import React from 'react';
import { Link } from 'react-router-dom';
import './Drawer.css';

const Drawer = () => {
	return (
		<div className="border-right " id="sidebar-wrapper">
			<div className="sidebar-heading">Mtech Express</div>
			<div className="list-group list-group-flush">
				<Link to="/home" className="list-group-item list-group-item-action">
					Dashboard
				</Link>
				<Link to="/new-order" className="list-group-item list-group-item-action">
					New Order
				</Link>
				<Link to="/clients" className="list-group-item list-group-item-action">
					Clients
				</Link>
				<Link to="#" className="list-group-item list-group-item-action">
					Search
				</Link>
				<Link to="#" className="list-group-item list-group-item-action">
					Settings
				</Link>
				<Link to="index.php?action=sign-out" className="list-group-item list-group-item-action">
					Sign Out
				</Link>
			</div>
		</div>
	);
};

export default Drawer;
