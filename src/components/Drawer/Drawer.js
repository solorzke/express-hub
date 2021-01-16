import React from 'react';
import { Link } from 'react-router-dom';
import './Drawer.css';

const Drawer = () => {
	return (
		<div className="border-right" id="sidebar-wrapper">
			<div className="sidebar-heading">Mtech Express</div>
			<div className="list-group list-group-flush">
				<Link to="/home" className="list-group-item list-group-item-action">
					<i className="fas fa-home pr-2" />
					Dashboard
				</Link>
				<Link to="/new-order" className="list-group-item list-group-item-action">
					<i className="far fa-plus-square pr-2" />
					New Order
				</Link>
				<Link to="/clients" className="list-group-item list-group-item-action">
					<i className="fas fa-users pr-2" />
					Clients
				</Link>
				<Link to="#" className="list-group-item list-group-item-action">
					<i className="fas fa-search pr-2" />
					Search
				</Link>
				<Link to="#" className="list-group-item list-group-item-action">
					<i className="fas fa-cog pr-2" />
					Settings
				</Link>
				<Link to="index.php?action=sign-out" className="list-group-item list-group-item-action">
					<i className="fas fa-sign-out-alt pr-2" />
					Sign Out
				</Link>
			</div>
		</div>
	);
};

export default Drawer;
