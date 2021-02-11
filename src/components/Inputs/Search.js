import React from 'react';
import './Search.css';

const SearchBar = (props) => {
	return (
		<div>
			<input
				type="text"
				class="form-control"
				placeholder="Search client's name"
				name="search"
				id="search"
				onChange={props.onChange}
			/>
			<div className="search-bar">
				{props.data.map((item) => (
					<a href={`/clients/${item.id}`}>
						<p className="py-2 pl-3 my-0">{props.formatString(item.name)}</p>
					</a>
				))}
			</div>
		</div>
	);
};

export default SearchBar;
