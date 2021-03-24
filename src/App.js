import React, { useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Cookie } from './data/Cookie';
import { ProtectedRoute } from './components/Protected/Route';
import Home from './pages/Home/Index';
import About from './pages/Home/About';
import ContactUs from './pages/Home/Contact';
import Index from './pages/Index';
import NewIndex from './pages/New/Index';
import AddClient from './pages/New/Client';
import AddOrder from './pages/New/Order';
import AddItems from './pages/New/Items';
import SubmitOrder from './pages/New/Submit';
import ClientIndex from './pages/Clients/Index';
import ClientSummary from './pages/Clients/Client';
import OrdersIndex from './pages/Orders/Index';
import Order from './pages/Orders/Order';
import UpdateItems from './pages/Orders/UpdateItems';
import SearchIndex from './pages/Search/Index';
import SettingsIndex from './pages/Settings/Index';
import ResetPassword from './pages/ForgotPassword';
import QuotesPage from './pages/Quotes/Quote';
import QuotesForm from './pages/Quotes/Form';
import QuotesIndex from './pages/Quotes/Index';
import Error404 from './pages/404';
import 'animate.css';

function App() {
	const [ auth, setAuth ] = useState(Cookie.getCookie('uid'));

	useEffect(() => setAuth(Cookie.checkCookie('uid')), []);

	return (
		<Switch>
			<ProtectedRoute isAuth={auth} path="/cloud/settings" component={SettingsIndex} />
			<ProtectedRoute isAuth={auth} path="/cloud/search" component={SearchIndex} />
			<ProtectedRoute isAuth={auth} path="/cloud/orders" component={OrdersIndex} />
			<ProtectedRoute isAuth={auth} path="/cloud/order/update-items" component={UpdateItems} />
			<ProtectedRoute isAuth={auth} path="/cloud/order" component={Order} />
			<ProtectedRoute isAuth={auth} path="/cloud/clients/:id" component={ClientSummary} />
			<ProtectedRoute isAuth={auth} path="/cloud/clients" component={ClientIndex} />
			<ProtectedRoute isAuth={auth} path="/cloud/quotes/quote" component={QuotesPage} />
			<ProtectedRoute isAuth={auth} path="/cloud/quotes/add" component={QuotesForm} />
			<ProtectedRoute isAuth={auth} path="/cloud/quotes" component={QuotesIndex} />
			<ProtectedRoute isAuth={auth} path="/cloud/new-order/add-order/add-items" component={AddItems} />
			<ProtectedRoute isAuth={auth} exact path="/cloud/new-order/add-order/submit" component={SubmitOrder} />
			<ProtectedRoute isAuth={auth} path="/cloud/new-order/add-client" component={AddClient} />
			<ProtectedRoute isAuth={auth} path="/cloud/new-order/add-order" component={AddOrder} />
			<ProtectedRoute isAuth={auth} path="/cloud/new-order" component={NewIndex} />
			<Route exact path="/cloud" component={Index} />
			<Route path="/about" component={About} />
			<Route path="/contact" component={ContactUs} />
			<Route path="/auth" component={ResetPassword} />
			<Route path="/" component={Home} />
			<Route component={Error404} />
		</Switch>
	);
}

export default App;
