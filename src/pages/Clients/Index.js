import React from 'react';
import Wrapper from '../../components/Wrapper/Wrapper';
import SearchBar from '../../components/Inputs/Search';

const Index = () => <Wrapper children={<Body />} current="Clients" active="clients" />;

const Body = () => {
	return (
		<main class="container p-3">
			<h1>Client Search</h1>
			<p class="pb-5">Find a client by search or selection to bring up their information and recent orders.</p>
			<form autoComplete="off">
				<div class="form-group row">
					<div class="form-group col-md-11">
						<SearchBar />
					</div>
					<div class="form-group col-md-1">
						<button class="btn btn-md btn-primary" id="submit">
							<i class="fas fa-search" />
						</button>
					</div>
				</div>
				<div className="form-group row pt-5">
					<div class="form-group col-md-12">
						<select class="custom-select" id="client" onchange="onSelect();">
							<option value="0">Or select a client...</option>
							{/* <?php foreach($clients as $client): ?> */}
							{/* <option value="<?php echo $client['client_id']; ?>">
                        <?php 
                            $fname = ucfirst($client['fname']);
                            $lname = ucfirst($client['lname']);
                            echo $fname.' '.$lname;
                        ?>
                    </option>
                    <?php endforeach; ?> */}
						</select>
					</div>
				</div>
			</form>
			<section id="results" />
			<script src="./model/scripts/js/search-clients.js" type="text/javascript" />
		</main>
	);
};

export default Index;
