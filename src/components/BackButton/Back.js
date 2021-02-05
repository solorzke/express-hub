import React from 'react';

const BackButton = ({ value, message, path }) => {
	//Warn the user before proceeding back to the first page that the current form data here will be lost
	const warnBeforeProceeding = (e) => {
		e.preventDefault();
		if (window.confirm(message)) window.location.href = path;
	};

	return (
		<div class="row">
			<div class="col-md-12 w-100 client-pane">
				<button
					class="float-sm-right btn btn-link btn-sm text-primary mx-2 px-3"
					onClick={(e) => warnBeforeProceeding(e)}
				>
					<i class="fas fa-arrow-left pr-2" />
					{value}
				</button>
			</div>
		</div>
	);
};

export default BackButton;
