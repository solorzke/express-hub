import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

const NavBar = () => (
	<Navbar bg="light" expand="lg" className="jo-font">
		<Navbar.Brand href="#home">Teloentrego</Navbar.Brand>
		<Navbar.Toggle aria-controls="basic-navbar-nav" />
		<Navbar.Collapse id="basic-navbar-nav">
			<Nav className="mr-auto">
				<Nav.Link href="#home">Inicio</Nav.Link>
				<Nav.Link href="#link">Sobre Nosotros</Nav.Link>
				<Nav.Link href="#link">Contacto</Nav.Link>
				<Nav.Link href="#link">Portal</Nav.Link>
			</Nav>
		</Navbar.Collapse>
	</Navbar>
);

export default NavBar;
