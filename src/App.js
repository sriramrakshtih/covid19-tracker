/** @format */

import {
	Card,
	CardContent,
	FormControl,
	MenuItem,
	Select,
} from "@material-ui/core";
/** @format */

import React, { useEffect, useState } from "react";
import "./App.css";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";

//https://disease.sh/v3/covid-19/countries
function App() {
	const [countries, setCountries] = useState([]);
	const [country, setCountry] = useState("worldwide");
	const [countryInfo, setCountryInfo] = useState({});
	const [tableData, setTableData] = useState([]);

	useEffect(() => {
		fetch("https://disease.sh/v3/covid-19/all")
			.then((response) => response.json())
			.then((data) => {
				setCountryInfo(data);
			});
	}, []);

	useEffect(() => {
		const getCountriesData = async () => {
			await fetch("https://disease.sh/v3/covid-19/countries")
				.then((response) => response.json())
				.then((data) => {
					const countries = data.map((country) => ({
						name: country.country,
						value: country.countryInfo.iso2,
					}));
					setTableData(data);
					setCountries(countries);
				});
		};

		getCountriesData();
	}, []);

	const onCountryChange = async (event) => {
		const countryCode = event.target.value;
		//console.log("YOooooooo >>>>>", countryCode);
		setCountry(countryCode);

		const url =
			countryCode === "worldwide"
				? "https://disease.sh/v3/covid-19/all"
				: `https://disease.sh/v3/covid-19/countries/${countryCode}`;

		await fetch(url)
			.then((response) => response.json())
			.then((data) => {
				setCountry(countryCode);
				//all data from country
				setCountryInfo(data);
			});

		//https://disease.sh/v3/covid-19/countries/[country_code]
	};

	//console.log("country info >>>>>>", countryInfo);
	return (
		<div className='app'>
			<div className='app__left'>
				<div className='app__header'>
					<h1>Covid-19 Tracker</h1>
					<FormControl className='app__dropdown'>
						<Select
							variant='outlined'
							value={country}
							onChange={onCountryChange}>
							{/* <MenuItem value='worldwide'>WorldWide</MenuItem>
						<MenuItem value='worldwide'>Option 2</MenuItem>
						<MenuItem value='worldwide'>Option 3</MenuItem>
						<MenuItem value='worldwide'>Option 4</MenuItem> */}
							<MenuItem value='worldwide'>Worldwide</MenuItem>
							{countries.map((country) => (
								<MenuItem value={country.value}>{country.name}</MenuItem>
							))}
						</Select>
					</FormControl>
				</div>

				<div className='app__stats'>
					<InfoBox
						title='Coronavirus Cases'
						cases={countryInfo.todayCases}
						total={countryInfo.cases}
					/>

					<InfoBox
						title='Recovered'
						cases={countryInfo.todayRecovered}
						total={countryInfo.recovered}
					/>

					<InfoBox
						title='Deaths'
						cases={countryInfo.todayDeaths}
						total={countryInfo.deaths}
					/>
					{/* Info boxes */}
					{/* Info boxes */}
				</div>

				{/* Map */}
				<Map />
			</div>
			<Card className='app__right'>
				<CardContent>
					<h3>Cases worldwide</h3>
					<Table countries={tableData} />
					<h3>Cases by country</h3>

					{/* Graph */}
				</CardContent>
			</Card>
		</div>
	);
}

export default App;
