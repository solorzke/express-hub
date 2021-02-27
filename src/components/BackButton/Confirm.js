import React from 'react';

const ConfirmButton = ({ onConfirm }) => {
	//Warn the user before proceeding back to the first page that the current form data here will be lost
	const warnBeforeProceeding = (e) => {
		e.preventDefault();
		const message = `Are you sure you'd like to cancel your order? All changes made will be lost.`;
		if (window.confirm(message)) window.location.href = '/new-order';
	};

	return (
		<div className="row pb-3">
			<div className="col-md-12 w-100 client-pane">
				<button className="float-sm-right btn btn-success btn-md mx-2 px-3" onClick={onConfirm}>
					Confirm
				</button>
				<button
					className="float-sm-right btn btn-secondary btn-md mx-2 px-3"
					onClick={(e) => warnBeforeProceeding(e)}
				>
					Cancel
				</button>
			</div>
		</div>
	);
};

export default ConfirmButton;
