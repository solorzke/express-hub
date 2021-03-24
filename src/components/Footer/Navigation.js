import React from 'react';
import { Table } from 'react-bootstrap';
import './Footer.css';

const Navigation = () => {
	return (
		<div className="navigation-footer">
			<div className="container-fluid">
				<div className="row">
					<div className="col-md-3 align-items-start d-flex flex-column">
						<i className="fas fa-shipping-fast brand footer-brand" />
						<h6 style={{ width: '60%', paddingTop: 10, paddingBottom: 10 }}>
							Fast Express Shipping Across Multiple Locations!
						</h6>
						<div className="row">
							<div className="col-lg">
								<a href="mailto:marcoasolorzano@gmail.com">
									<i className="far fa-envelope footer-icon" />
								</a>
								<a href="#">
									<i className="fas fa-phone footer-icon" />{' '}
								</a>
								<a href="https://www.facebook.com" target="_blank">
									<i className="fab fa-facebook-f footer-icon" />{' '}
								</a>
							</div>
						</div>
					</div>
					<div className="col-md-4 offset-md-5">
						<Table borderless responsive="md">
							<thead>
								<tr>
									<th className="banner-title">Services</th>
									<th className="banner-title">Contact</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>
										<a href="#">How To Order</a>
									</td>
									<td>
										<a href="/contact">Location</a>
									</td>
								</tr>
								<tr>
									<td>
										<a href="/services/101">Shipping Costs</a>
									</td>
									<td>
										<a href="/message">Message Me</a>
									</td>
								</tr>
								<tr>
									<td />
									<td>
										<a href="/contact">Contact Shipping Co.</a>
									</td>
								</tr>
							</tbody>
						</Table>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Navigation;
