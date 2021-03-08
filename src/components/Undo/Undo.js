import React from 'react';

const Undo = ({ onClose, onClick }) => (
	<div className="col-md">
		<button className="d-inline float-left btn btn-link" onClick={onClose}>
			<i className="fas fa-times" />
		</button>
		<button className="d-inline btn btn-link" onClick={onClick}>
			Undo
		</button>
	</div>
);

export default Undo;
