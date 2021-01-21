import React from 'react';
import { Toast } from 'react-bootstrap';
import './Toast.css';

const Message = ({ message, heading, img, show, onClose }) => {
	return (
		<div aria-live="polite" aria-atomic="true" className="toast-div">
			<Toast className="toast-element" show={show} onClose={onClose}>
				<Toast.Header>
					{img}
					<strong className="mr-auto">{heading}</strong>
				</Toast.Header>
				<Toast.Body>{message}</Toast.Body>
			</Toast>
		</div>
	);
};

export default Message;
