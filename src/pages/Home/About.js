import React from 'react';
import Nav from '../../components/Nav/Navbar';
import Banner from '../../components/Banner/Banner';
import Footer from '../../components/Footer/Footer';
import Globe from '../../media/globe.gif';
import Button from '../../components/Button/Button';
import { Fragment } from 'react';

const About = () => (
	<Fragment>
		<Nav active="about" />
		<main className="main-bg">
			<Banner height="60vh" />
			<FirstSummary />
			<SecondSummary />
			<ContactInfo />
			<Location />
			<ContactUs />
		</main>
		<Footer />
	</Fragment>
);

const FirstSummary = () => (
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

const SecondSummary = () => (
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

const ContactInfo = () => (
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

const Location = () => (
	<div className="piece-light">
		<div className="container">
			<div className="row">
				<div className="col-lg-6 align-items-center justify-content-center piece-light">
					<i className="fas fa-compass banner-title" style={{ fontSize: 35 }} />
					<h6 className="banner-title">Gran Servicio De Entrega Optimizado</h6>
					<h4 className="banner-title">Herramientas De Gestión y Flujo De Trabajo</h4>
					<br />
					<p>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
						labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
						laboris nisi ut aliquip ex ea commodo consequat.
					</p>
					<p>
						<i className="fas fa-check" />
						Lorem ipsum dolor sit amet, consectetur adipiscing elit
					</p>
					<p>
						<i className="fas fa-check" />
						Lorem ipsum dolor sit amet, consectetur adipiscing elit
					</p>
					<p>
						<i className="fas fa-check" />
						Lorem ipsum dolor sit amet, consectetur adipiscing elit
					</p>
					<p>
						<i className="fas fa-check" />
						Lorem ipsum dolor sit amet, consectetur adipiscing elit
					</p>
					<p>
						<i className="fas fa-check" />
						Lorem ipsum dolor sit amet, consectetur adipiscing elit
					</p>
					<a href="#">
						<Button label="Learn more" />
					</a>
				</div>

				<div className="col-lg-6 d-flex align-items-center justify-content-center">
					<img
						src={Globe}
						alt="Entrega De Mensajería Libre De Regalías Ilustración - Mensajero Png ..."
						height="400"
						width="400"
					/>
				</div>
			</div>
		</div>
	</div>
);

const ContactUs = () => (
	<div className="container-fluid">
		<div className="row">
			<div className="col-md">
				<div className="section-contact-us">
					<h1 className="banner-title">¿Necesitas Envío?</h1>
					<a href="#">
						<Button label="Contact Us" />
					</a>
				</div>
			</div>
		</div>
	</div>
);

export default About;
