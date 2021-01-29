import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Index from './pages/Index';
import Home from './pages/Home';
import NewIndex from './pages/New/Index';
import AddClient from './pages/New/Client';
import AddOrder from './pages/New/Order';
import AddItems from './pages/New/Items';
import ClientIndex from './pages/Clients/Index';
import Test from './pages/Test';
import Error404 from './pages/404';

function App() {
	return (
		<Switch>
			<Route path="/test" component={Test} />
			<Route path="/home" component={Home} />
			<Route path="/clients" component={ClientIndex} />
			<Route path="/new-order/add-order/add-items" component={AddItems} />
			<Route path="/new-order/add-client" component={AddClient} />
			<Route path="/new-order/add-order" component={AddOrder} />
			<Route path="/new-order" component={NewIndex} />
			<Route exact path="/" component={Index} />
			<Route component={Error404} />
		</Switch>
	);
}

export default App;
