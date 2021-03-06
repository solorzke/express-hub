import React from 'react';
import './Drawer.css';
import Firebase from 'firebase/app';
import 'firebase/auth';
import { Config } from '../../data/Config';
import { Cookie } from '../../data/Cookie';

Firebase.apps.length === 0 ? Firebase.initializeApp(Config) : Firebase.app();

const Drawer = ({ active = '' }) => {
	const onSignOut = (e) => {
		e.preventDefault();
		Firebase.auth()
			.signOut()
			.then(() => {
				console.log('> Firebase: Sign out successful');
				Cookie.deleteCookie('fname');
				Cookie.deleteCookie('uid');
				window.location.href = '/cloud';
			})
			.catch((error) => {
				alert(
					'No se puede cerrar la sesión en este momento. Consulte los registros para obtener más detalles.'
				);
				console.error("> Firebase: Couldn't sign out of the session. Seek admin for help");
				console.error(error);
			});
	};

	return (
		<div className="border-right" id="sidebar-wrapper">
			<div className="sidebar-heading jo-font">Teloentrego</div>
			<div className="list-group list-group-flush">
				{/* <a href="/home" className="list-group-item list-group-item-action">
					<span className={active === 'dashboard' ? 'activated' : ''}>
						<i className="fas fa-home pr-2" />Dashboard
					</span>
				</a> */}
				<a href="/cloud/new-order" className="list-group-item list-group-item-action">
					<span className={active === 'new' ? 'activated' : ''}>
						<i className="far fa-plus-square pr-2" />
						Nuevo Orden
					</span>
				</a>
				<a href="/cloud/quotes" className="list-group-item list-group-item-action">
					<span className={active === 'quotes' ? 'activated' : ''}>
						<i className="fas fa-quote-right pr-2" />
						Cotizaciónes
					</span>
				</a>
				<a href="/cloud/clients" className="list-group-item list-group-item-action">
					<span className={active === 'clients' ? 'activated' : ''}>
						<i className="fas fa-users pr-2" />Clientes
					</span>
				</a>
				<a href="/cloud/orders" className="list-group-item list-group-item-action">
					<span className={active === 'orders' ? 'activated' : ''}>
						<i className="fas fa-file-invoice pr-2" />Pedidos
					</span>
				</a>
				<a href="/cloud/search" className="list-group-item list-group-item-action">
					<span className={active === 'search' ? 'activated' : ''}>
						<i className="fas fa-search pr-2" />Buscar
					</span>
				</a>
				<a href="/cloud/settings" className="list-group-item list-group-item-action">
					<span className={active === 'settings' ? 'activated' : ''}>
						<i className="fas fa-cog pr-2" />Ajustes
					</span>
				</a>
				<button className="list-group-item list-group-item-action" onClick={onSignOut.bind(this)}>
					<i className="fas fa-sign-out-alt pr-2" />
					Desconectar
				</button>
			</div>
		</div>
	);
};

export default Drawer;
