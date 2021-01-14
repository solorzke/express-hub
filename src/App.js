import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Index from './pages/Index';
import Home from './pages/Home';

function App() {
	return (
		<Switch>
			<Route path="/home" component={Home} />
			<Route path="/" component={Index} />
		</Switch>
	);
}

export default App;
