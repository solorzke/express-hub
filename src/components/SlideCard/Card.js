import React from 'react';
import { Accordion, Button } from 'react-bootstrap';

const SlideCard = ({ children, title, options = null, icon }) => (
	<Accordion defaultActiveKey="0" className="col-lg-12 mb-4">
		<h4>
			<i className={icon} style={{ color: '#2a1e5c' }} />
			{title}
			{options !== null ? options : <React.Fragment />}
			<Accordion.Toggle as={Button} variant="link" eventKey="0">
				<i className="pl-2 fas fa-chevron-down text-secondary" style={{ fontSize: '15px' }} />
			</Accordion.Toggle>
		</h4>
		<Accordion.Collapse eventKey="0">{children}</Accordion.Collapse>
		<hr />
	</Accordion>
);

export default SlideCard;
