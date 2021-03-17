import React from 'react';
import { Breadcrumb } from 'react-bootstrap';

const Paths = ({ links, message, historyHook }) => {
	const onClick = (index) => {
		if (window.confirm(message)) historyHook.go(index);
	};

	return (
		<Breadcrumb>
			{links.map((link, index) => {
				if (index !== links.length - 1) {
					return (
						<Breadcrumb.Item
							key={index}
							href={link.route}
							onClick={(e) => {
								e.preventDefault();
								if (message !== undefined) onClick(index);
							}}
						>
							{link.name}
						</Breadcrumb.Item>
					);
				} else {
					return <Breadcrumb.Item active>{link.name}</Breadcrumb.Item>;
				}
			})}
		</Breadcrumb>
	);
};

export default Paths;
