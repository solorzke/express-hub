import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

const NavBar = ({ active }) => (
	<Navbar style={{ backgroundColor: '#34345B' }} expand="lg" className="jo-font" variant="dark">
		<Navbar.Brand href="#home" style={{ color: '#ee4266' }}>
			Teloentrego
		</Navbar.Brand>
		<Navbar.Toggle aria-controls="basic-navbar-nav" />
		<Navbar.Collapse id="basic-navbar-nav">
			<Nav className="mr-auto">
				<Nav.Link active={active === 'home' ? true : false} href="/">
					Inicio
				</Nav.Link>
				<Nav.Link active={active === 'about' ? true : false} href="/about">
					Sobre Nosotros
				</Nav.Link>
				<Nav.Link active={active === 'contact' ? true : false} href="/contact">
					Contacto
				</Nav.Link>
				<Nav.Link active={active === 'cloud' ? true : false} href="/cloud">
					Portal
				</Nav.Link>
			</Nav>
		</Navbar.Collapse>
	</Navbar>
);

export default NavBar;
