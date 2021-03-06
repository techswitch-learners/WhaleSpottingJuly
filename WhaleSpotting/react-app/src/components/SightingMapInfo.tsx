import React, { useEffect, useState } from "react";
import WeatherApiModel from "../api/models/WeatherApiModel";
import { Chosen } from "./Map";
import "../styles/SightingMapInfo.scss";
import { Species } from "../api/ApiEnums";
import { WhaleImageDictionary, WhaleVisualTextDictionary } from "../api/ApiLookups";
import { fetchSpecies } from "../api/apiClient";

interface SightingMapInfoProps {
    chosen: Chosen | undefined;
}

interface IResponse {
    lon: number | void,
    lat: number | void,
    species: Species[]
}

export default function SightingMapInfo({ chosen }: SightingMapInfoProps): JSX.Element {

    const key = process.env.REACT_APP_WEATHER_API_KEY;

    const [weatherData, setWeatherData] = useState<WeatherApiModel>();
    const [speciesData, setSpeciesData] = useState<Species[]>([]);
    const [closeCard, setCardState] = useState(true);

    useEffect(() => {
        if (chosen) {
            fetchWeather();
            getSpecies();
        }
    }, [chosen]);

    async function getSpecies() {
        if (chosen) {
            setSpeciesData(await fetchSpecies(chosen.lon, chosen.lat));
        }
    }

    const images = speciesData.map(s =>
        <div className={speciesData.length > 1 ? "whale-image-container" : "whale-image-container-single"}
            key={s}
            data-testid={speciesData.length > 1 ? "whale-image-container" : "whale-image-container-single"}>
            <img className="whale-image" src={WhaleImageDictionary[s]} alt="local species" />
        </div>);

    const response: IResponse = {
        lon: chosen?.lon,
        lat: chosen?.lat,
        species: speciesData,
    };

    if (!chosen || !weatherData) {
        return <div className="weather-component-empty" data-testid="loading"></div>;
    }

    return (
        <div className="weather-component" data-testid="weather"
            onClick={() => setCardState(!closeCard)}>
            <div>Information about this sighting</div>
            <div className="location">Latitude: {weatherData.lat}°  Longitude: {weatherData.lon}°</div>
            <div className="sighting-info">
                <div className="weather-info">Current Weather: {weatherData.current.weather[0].main}
                    <ul className="list">
                        <li>Temperature: {weatherData.current.temp}°C</li>
                        <li>Wind Speed: {weatherData.current.wind_speed} m/s</li>
                        <li>Visibility: {weatherData.current.visibility} m</li>
                    </ul>
                </div>
                <div className="species">Species spotted here:
                    <ul className="list">{getHumanReadableWhaleNames(response).map(s =>
                        <li key={s}>{s}</li>)}</ul>
                </div>
                <div className={closeCard ? "whale-image-container closed" : "whale-image-container"}
                    hidden={speciesData.length > 1}>
                    {images.length == 0 ? "whaleicon512.png" : images[0]}
                </div>
            </div>
            <div className={speciesData.length <= 1 ? "hidden" :
                closeCard ? "all-pictures closed" : "all-pictures"}>
                {images}
            </div>
        </div>
    );

    async function fetchWeather(): Promise<WeatherApiModel | void> {
        if (chosen) {
            return await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${chosen.lat}&lon=${chosen.lon}&units=metric&Appid=${key}`)
                .then(response => response.json())
                .then(response => setWeatherData(response));
        }
    }
}

function getHumanReadableWhaleNames(response: IResponse): Array<string> {
    const humanNames = [];
    for (let i = 0; i < response.species.length; i++) {
        const speciesEnum = response.species[i];
        humanNames.push(WhaleVisualTextDictionary[speciesEnum]);
    }
    return humanNames;
}
