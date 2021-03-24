import React from 'react';

const ConfirmButton = ({ onConfirm }) => {
	//Warn the user before proceeding back to the first page that the current form data here will be lost
	const warnBeforeProceeding = (e) => {
		e.preventDefault();
		const message = `Are you sure you'd like to cancel your order? All changes made will be lost.`;
		if (window.confirm(message)) window.location.href = '/cloud/new-order';
	};

	return (
		<div className="client-pane justify-content-end align-items-center d-flex">
			<button
				className="float-sm-right btn btn-secondary btn-md mx-2 px-3"
				onClick={(e) => warnBeforeProceeding(e)}
			>
				Cancel
			</button>
			<button className="float-sm-right btn btn-success btn-md mx-2 px-3" onClick={onConfirm}>
				Confirm
			</button>
		</div>
	);
};

export default ConfirmButton;
