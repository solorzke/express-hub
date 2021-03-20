import React, { useState } from 'react';
import './Search.css';

const SearchBar = (props) => {
	const [ inputLength, setInputLength ] = useState(0);

	const handleOnChange = (e) => {
		props.onChange(e);
		setInputLength(e.target.value.length);
	};

	return (
		<div className="input-group mb-3">
			<div className="input-group-prepend">
				<span className="input-group-text" id="basic-addon1">
					<i className="fas fa-search" />
				</span>
			</div>
			<input
				type="text"
				className="form-control"
				placeholder="Buscar el nombre del cliente"
				name="search"
				id="search"
				onChange={handleOnChange.bind(this)}
			/>
			<div className="search-bar">
				{props.data.map((item, index) => (
					<a href={item.path} key={index}>
						<p className="py-2 pl-3 my-0">{props.formatString(item.detail)}</p>
					</a>
				))}
			</div>
			<ResultsCounter data={props.data} inputLength={inputLength} />
		</div>
	);
};

const ResultsCounter = ({ data, inputLength }) => {
	const dataLength = data.length;
	if (data.length > 0) {
		return <p className="py-2 pl-3 my-0 bg-secondary text-light search-bar">{dataLength} resultados encontrados</p>;
	} else if (data.length === 0 && inputLength > 0) {
		return <p className="py-2 pl-3 my-0 bg-secondary text-light search-bar">0 resultados encontrados</p>;
	} else {
		return '';
	}
};

export default SearchBar;
