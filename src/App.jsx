import React, { useState, useEffect } from 'react';

import { FormControl, Card, CardContent, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import 'leaflet/dist/leaflet.css';

import styles from './App.module.css';
import InfoBox from './components/InfoBox';
import { TableOne, TableTotal} from './components/Table';
import { sortData, sortDataOneMillion } from './util.js';
import BarGraph from './components/BarGraph';
import Map from './components/Map';
import './GlobalStyles.css';

function App() {
    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState({name: 'Worldwide', value: 'worldwide'});
    const [countryInfo, setCountryInfo] = useState({});
    const [tableDataOne, setTableDataOne] = useState([]);
    const [tableDataTotal, setTableDataTotal] = useState([])
    const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
    const [mapZoom, setMapZoom] = useState(3);
    const [mapCountries, setMapCountries] = useState([]);
    const [casesType, setCasesType] = useState("cases");

    const urlCountry = 'https://disease.sh/v3/covid-19/countries';
    const urlAll = 'https://disease.sh/v3/covid-19/all';
    const worldwidePosition = { lat: 34.80746, lng: -40.4796 };

    useEffect(() => {
        fetch(urlAll)
            .then((response) => response.json())
            .then((data) => {
                setCountryInfo(data);
            })
    }, []);


    useEffect(() => {
        const getCountriesData = async () => {
            await fetch(urlCountry)
                .then((response) => response.json())
                .then((data) => {
                    const countries = data.map((country) => (
                        {
                            name: country.country,
                            value: country.countryInfo.iso2
                        }
                    ));
                    const sortedData = sortData(data);
                    const sortedDataOneMillion = sortDataOneMillion(data);
                    setTableDataOne(sortedDataOneMillion);
                    setTableDataTotal(sortedData);
                    setMapCountries(data);
                    setCountries(countries);
                });      
        }
        getCountriesData();
    }, []);

    const onCountryChange = async (event, value, reason) => {
        const countryCode = value ? value : 'Worldwide';

         const url = countryCode === 'Worldwide' ? urlAll : `${urlCountry}/${countryCode}`;

        await fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setCountry(countryCode);
                setCountryInfo(data);
                setMapCenter(countryCode === 'Worldwide' ? worldwidePosition : [data.countryInfo.lat, data.countryInfo.long]);
                setMapZoom(countryCode === 'Worldwide' ? 3 : 4);
            });
    }

    return (
        <div className={styles.app}>
            <div className={styles.appLeft}>
                <div className={styles.header}>
                    <h1>COVID-19 TRACKER</h1>
                    <FormControl className={styles.dropdown}>
                        <Autocomplete
                            options={countries}
                            getOptionLabel={(option) => option.name}
                            onInputChange={onCountryChange}
                            defaultValue={country}
                            style={{ width: 300 }}
                            renderInput={(params) => <TextField {...params}  value={country.value} ></TextField>}  
                        /> 
                    </FormControl>
                </div>
                <div className={styles.stats} >
                    <InfoBox
                        isRed
                        active={casesType === "cases"}
                        onClick={(e) => setCasesType("cases")}
                        title="Coronavirus Cases"
                        cases={countryInfo.todayCases}
                        total={countryInfo.cases} />
                    <InfoBox
                        active={casesType === "recovered"}
                        onClick={(e) => setCasesType("recovered")}
                        title="Recovered"
                        cases={countryInfo.todayRecovered}
                        total={countryInfo.recovered} />
                    <InfoBox
                        isGrey
                        active={casesType === "deaths"}
                        onClick={(e) => setCasesType("deaths")}
                        title="Deaths"
                        cases={countryInfo.todayDeaths}
                        total={countryInfo.deaths} />
                </div>
                <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom} />
            </div>
            <div>
                <Card className={styles.appRight} >
                    <CardContent>
                        <h3>Worldwide daily new {casesType}</h3>
                        <BarGraph className={styles.graph} casesType={casesType} />
                        <h3 className={styles.tableTitle}>COVID-19 cases and tests per one million population</h3>
                        <TableOne countries={tableDataOne} />
                        <h3 className={styles.tableTitle}>Total cases and tests by Country</h3>
                        <TableTotal countries={tableDataTotal} />    
                    </CardContent>
                </Card>
            </div>
        </div >
    )
}

export default App;
