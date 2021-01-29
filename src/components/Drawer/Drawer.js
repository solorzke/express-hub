import React from 'react';
import { Link } from 'react-router-dom';
import './Drawer.css';

const Drawer = ({ active = '' }) => {
	return (
		<div className="border-right" id="sidebar-wrapper">
			<div className="sidebar-heading">Mtech Express</div>
			<div className="list-group list-group-flush">
				<Link to="/home" className="list-group-item list-group-item-action">
					<span className={active === 'dashboard' ? 'activated' : ''}>
						<i className="fas fa-home pr-2" />Dashboard
					</span>
				</Link>
				<Link to="/new-order" className="list-group-item list-group-item-action">
					<span className={active === 'new' ? 'activated' : ''}>
						<i className="far fa-plus-square pr-2" />
						New Order
					</span>
				</Link>
				<Link to="/clients" className="list-group-item list-group-item-action">
					<span className={active === 'clients' ? 'activated' : ''}>
						<i className="fas fa-users pr-2" />Clients
					</span>
				</Link>
				<Link to="#" className="list-group-item list-group-item-action">
					<span className={active === 'search' ? 'activated' : ''}>
						<i className="fas fa-search pr-2" />Search
					</span>
				</Link>
				<Link to="#" className="list-group-item list-group-item-action">
					<span className={active === 'settings' ? 'activated' : ''}>
						<i className="fas fa-cog pr-2" />Settings
					</span>
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
