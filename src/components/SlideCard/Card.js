import React from 'react';
import { Accordion, Button } from 'react-bootstrap';

const SlideCard = ({ children, title }) => (
	<Accordion defaultActiveKey="0" className="col-md-6 mb-4 w-50">
		<h4>
			{title}
			<Accordion.Toggle as={Button} variant="link" eventKey="0">
				<i class="pl-2 fas fa-chevron-down text-secondary" style={{ fontSize: '15px' }} />
			</Accordion.Toggle>
		</h4>
		<Accordion.Collapse eventKey="0">{children}</Accordion.Collapse>
		<hr />
	</Accordion>
);

export default SlideCard;
