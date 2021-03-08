import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Cookie } from './data/Cookie';
import Index from './pages/Index';
// import Home from './pages/Home';
import NewIndex from './pages/New/Index';
import AddClient from './pages/New/Client';
import AddOrder from './pages/New/Order';
import AddItems from './pages/New/Items';
import SubmitOrder from './pages/New/Submit';
import ClientIndex from './pages/Clients/Index';
import ClientSummary from './pages/Clients/Client';
import Order from './pages/Orders/Order';
import UpdateItems from './pages/Orders/UpdateItems';
import SearchIndex from './pages/Search/Index';
import SettingsIndex from './pages/Settings/Index';
import ResetPassword from './pages/ForgotPassword';
import Error404 from './pages/404';
import 'animate.css';

function App() {
	const loggedIn = Cookie.checkCookie('uid');
	console.log(`> Firebase: User is ${loggedIn ? 'logged in' : 'not logged in'}`);
	if (loggedIn) {
		return (
			<Switch>
				<Route path="/auth" component={ResetPassword} />
				{/* <Route path="/home" component={Home} /> */}
				<Route path="/settings" component={SettingsIndex} />
				<Route path="/search" component={SearchIndex} />
				<Route path="/order/update-items" component={UpdateItems} />
				<Route path="/order" component={Order} />
				<Route path="/clients/:id" component={ClientSummary} />
				<Route path="/clients" component={ClientIndex} />
				<Route path="/new-order/add-order/add-items" component={AddItems} />
				<Route exact path="/new-order/add-order/submit" component={SubmitOrder} />
				<Route path="/new-order/add-client" component={AddClient} />
				<Route path="/new-order/add-order" component={AddOrder} />
				<Route path="/new-order" component={NewIndex} />
				<Route exact path="/" component={Index} />
				<Route component={Error404} />
			</Switch>
		);
	} else {
		return (
			<Switch>
				<Route path="/auth" component={ResetPassword} />
				<Route exact path="/" component={Index} />
				<Route component={Error404} />
			</Switch>
		);
	}
}

export default App;
