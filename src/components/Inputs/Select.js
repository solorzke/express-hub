import React from 'react';
import Async from 'react-async';

const AsyncSelect = ({ required = false, refs, promiseFn, formatString, onChange }) => {
	return (
		<div>
			<label>Cliente</label>
			<select required={required} ref={refs} className="custom-select" id="client" onChange={onChange}>
				<option value="" disabled selected>
					Selecciona un cliente
				</option>
				<Async promiseFn={promiseFn} onReject={(e) => console.log(e.message)}>
					{({ data, err, isLoading }) => {
						if (isLoading) return 'Loading...';
						if (err) return `Something went wrong: ${err.message}`;
						if (data) {
							return data.map((item, index) => {
								let full_name = formatString(`${item.fname} ${item.lname}`);
								return (
									<option value={item.id} key={index}>
										{full_name}
									</option>
								);
							});
						}
						return null;
					}}
				</Async>
			</select>
		</div>
	);
};

export default AsyncSelect;
