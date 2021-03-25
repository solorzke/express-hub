import React from 'react';
import Navbar from '../../components/Nav/Navbar';
import Banner from '../../components/Banner/Banner';
import Footer from '../../components/Footer/Footer';
import Globe from '../../media/globe.gif';
import { Tab, Nav } from 'react-bootstrap';
import Button from '../../components/Button/Button';
import { Fragment } from 'react';

const ContactUs = () => (
	<Fragment>
		<Navbar active="contact" />
		<main className="main-bg">
			<Banner height="60vh" />
			<Info />
			<Summary />
			<Message />
		</main>
		<Destination />
		<Footer />
	</Fragment>
);

const Info = () => (
	<div className="contact">
		<div className="container">
			<div className="row">
				<div className="col">
					<h1 style={{ paddingTop: 20, paddingBottom: 20 }}>Nuestra Información De Contacto</h1>
					<div className="row">
						<div className="col-md">
							<i className="far fa-envelope footer-icon contact-link">
								<a href="#">mtech@email.com</a>
							</i>
						</div>
						<div className="col-md">
							<i className="fas fa-phone footer-icon contact-link" />
							<a href="#">(201)-125-4158</a>
						</div>
						<div className="col-md">
							<i className="fab fa-facebook-f footer-icon contact-link" />
							<a href="#">Teloentregoec</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
);

const Message = () => (
	<div className="container-fluid">
		<div className="row">
			<div className="col-md">
				<div className="section-contact-us">
					<h1 className="banner-title text-center">¿Necesitas Envío?</h1>
					<a href="#">
						<Button label="Manda Un Mensaje" />
					</a>
				</div>
			</div>
		</div>
	</div>
);

const Summary = () => (
	<div className="summary">
		<div className="container">
			<div className="row">
				<div className="col-md-5 align-content-center d-flex flex-column">
					<h6>Excepteur sint occaecat cupidatat</h6>
					<h1>Lorem ipsum dolor sit amet, consectetur</h1>
				</div>
				<div className="col-md-7 justify-content-center d-flex flex-column">
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
						labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
						laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
						voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
						non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
					</p>
				</div>
			</div>
		</div>
	</div>
);

const Destination = () => (
	<div className="tabs-destinations">
		<div className="container-fluid">
			<div className="row">
				<div className="col-md-4 d-flex align-items-center justify-content-center">
					<img src={Globe} alt="Globe" className="globe-img" />
				</div>
				<div className="col-md-8 align-items-center justify-content-center piece-light">
					<i className="fas fa-globe banner-title" style={{ fontSize: 35 }} />
					<h6 className="banner-title">Envíos A Varias Ciudades</h6>
					<h1 className="banner-title">Ubicaciones</h1>
					<br />
					<Tab.Container defaultActiveKey="first">
						<div className="row">
							<div className="col-lg">
								<Nav variant="pills" className="flex-column">
									<Nav.Item>
										<Nav.Link eventKey="first">Quito</Nav.Link>
									</Nav.Item>
									<Nav.Item>
										<Nav.Link eventKey="second">Guayaquil</Nav.Link>
									</Nav.Item>
									<Nav.Item>
										<Nav.Link eventKey="third">Loja</Nav.Link>
									</Nav.Item>
									<Nav.Item>
										<Nav.Link eventKey="fourth">Cuenca</Nav.Link>
									</Nav.Item>
									<Nav.Item>
										<Nav.Link eventKey="fifth">Macara</Nav.Link>
									</Nav.Item>
									<Nav.Item>
										<Nav.Link eventKey="sixth">Cariamanga</Nav.Link>
									</Nav.Item>
								</Nav>
							</div>
							<div className="col-lg">
								<Tab.Content>
									<Tab.Pane eventKey="first">
										<p>
											Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
											tempor incididunt ut labore et dolore magna aliqua.
										</p>
									</Tab.Pane>
									<Tab.Pane eventKey="second">
										<p>
											Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
											tempor incididunt ut labore et dolore magna aliqua.
										</p>
									</Tab.Pane>
									<Tab.Pane eventKey="third">
										<p>
											Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
											tempor incididunt ut labore et dolore magna aliqua.
										</p>
									</Tab.Pane>
									<Tab.Pane eventKey="fourth">
										<p>
											Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
											tempor incididunt ut labore et dolore magna aliqua.
										</p>
									</Tab.Pane>
									<Tab.Pane eventKey="fifth">
										<p>
											Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
											tempor incididunt ut labore et dolore magna aliqua.
										</p>
									</Tab.Pane>
									<Tab.Pane eventKey="sixth">
										<p>
											Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
											tempor incididunt ut labore et dolore magna aliqua.
										</p>
									</Tab.Pane>
								</Tab.Content>
							</div>
						</div>
					</Tab.Container>
				</div>
			</div>
		</div>
	</div>
);

export default ContactUs;
