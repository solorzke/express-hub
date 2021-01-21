import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Index from './pages/Index';
import Home from './pages/Home';
import NewIndex from './pages/New/Index';
import AddClient from './pages/New/Client';
import AddOrder from './pages/New/Order';

function App() {
	return (
		<Switch>
			<Route path="/home" component={Home} />
			<Route path="/new-order/add-client" component={AddClient} />
			<Route path="/new-order/add-order" component={AddOrder} />
			<Route path="/new-order" component={NewIndex} />
			<Route path="/" component={Index} />
		</Switch>
	);
}

export default App;
