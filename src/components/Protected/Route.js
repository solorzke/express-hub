import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const ProtectedRoute = ({ component: Component, isAuth: isAuthenticated, ...rest }) => {
	return (
		<Route
			{...rest}
			render={(props) => {
				if (isAuthenticated) {
					return <Component />;
				} else {
					return <Redirect to={{ pathname: '/cloud', state: { from: props.location } }} />;
				}
			}}
		/>
	);
};
