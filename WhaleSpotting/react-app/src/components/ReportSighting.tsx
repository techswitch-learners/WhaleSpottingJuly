import "../styles/ReportSighting.scss";
import React, { useState } from "react";
import { BannerImage } from "./BannerImage";
import ShowResultMessage from "./ShowResultMessage";
import { CreateSightingApiModel } from "../api/models/CreateSightingApiModel";
import { Species, OrcaType } from "../api/ApiEnums";
import { createSighting } from "../api/apiClient";

export default function ReportSighting(): JSX.Element {
    const [date, setDate] = useState<Date>(new Date());
    const [location, setLocation] = useState<string>("");
    const [species, setSpecies] = useState<Species>(1);
    const [quantity, setQuantity] = useState(0);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [latitude, setLatitude] = useState<number | null>(null);
    const [orcaPod, setOrcaPod] = useState<string>("");
    const [orcaType, setOrcaType] = useState<OrcaType | number>(0);
    const [description, setDescription] = useState<string>("");
    const [responseMessage, setResponseMessage] = useState<string>();
    const [showForm, setShowForm] = useState<boolean>(true);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const sighting: CreateSightingApiModel = {
            species: species,
            quantity: quantity,
            description: description,
            longitude: longitude,
            latitude: latitude,
            location: location,
            sightedAt: date,
            orcaPod: orcaPod,
            orcaType: orcaType === 0 ? null : orcaType
        };

        let isError = false;
        const response = await createSighting(sighting)
            .then(r => {
                if (r.status === 400) {
                    isError = true;
                    return r.json();
                }
                return r.json();
            })
            .catch(r => {
                isError = true;
                return r.json();
            });

        if (isError) {
            handleError(response);
        } else {
            setResponseMessage("Successful submission. An admin will review it shortly.");
            setShowForm(false);
        }
    }

    function handleError(response: any) {
        const keys = Object.keys(response.errors);
        setResponseMessage("Unsuccessful submission: " + response.errors[keys[0]][0]);
        window.scrollTo(0, 0);
    }

    function resetForm() {
        setDate(new Date());
        setLocation("");
        setSpecies(1);
        setQuantity(0);
        setLongitude(null);
        setLatitude(null);
        setOrcaPod("");
        setOrcaType(0);
        setDescription("");
        setResponseMessage("");
        setShowForm(true);
    }

    function formatDate(date: Date | null): string {
        if (!date) {
            return "";
        }
        let month = "" + ((date.getMonth() ?? 0) + 1);
        let day = "" + date.getDate();
        const year = date.getFullYear();

        if (month.length < 2)
            month = "0" + month;
        if (day.length < 2)
            day = "0" + day;

        return [year, month, day].join("-");
    }

    return (
        <div className="report-sighting" data-testid="report-sighting">
            <BannerImage />
            <div className="container">
                <h2 className="title">Report Your Sighting</h2>
                {showForm
                    ?
                    <form onSubmit={handleSubmit}>
                        <ShowResultMessage backgroundRed={true} responseMessage={responseMessage} />
                        <div className="card-component">
                            <div className="sighting-details">
                                <div className="input-box">
                                    <label >Sighting Date Time <span className="required">(required)</span></label>
                                    <input className="input-field" name="date" type="date" placeholder="Enter sighting date" required
                                        max={formatDate(new Date())}
                                        onChange={(e) => setDate(new Date(e.target.value))} />
                                </div>
                                <div className="input-box">
                                    <label>Location <span className="required">(required)</span></label>
                                    <input className="input-field" type="text" name="location" placeholder="Enter your location" required
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)} />
                                </div>
                                <div className="input-box">
                                    <label>Species <span className="required">(required)</span></label>
                                    <select className="input-field" onChange={(e) => { setSpecies(parseInt(e.target.value)); }} defaultValue={Species.AtlanticWhiteSidedDolphin}>
                                        <option value={Species.AtlanticWhiteSidedDolphin}>Atlantic White Sided Dolphin</option>,
                                        <option value={Species.CaliforniaSeaLion}>California Sea Lion</option>,
                                        <option value={Species.DallsPorpoise}>Dalls Porpoise</option>,
                                        <option value={Species.GrayWhale}>Gray Whale</option>,
                                        <option value={Species.HarborPorpoise}>Harbor Porpoise</option>,
                                        <option value={Species.HarborSeal}>Harbor Seal</option>,
                                        <option value={Species.Humpback}>Humpback</option>,
                                        <option value={Species.Minke}>Minke</option>,
                                        <option value={Species.NorthernElephantSeal}>Northern Elephant Seal</option>,
                                        <option value={Species.Orca}>Orca</option>,
                                        <option value={Species.Other}>Other</option>,
                                        <option value={Species.PacificWhiteSidedDolphin}>Pacific White Sided Dolphin</option>,
                                        <option value={Species.SeaOtter}>Sea Otter</option>,
                                        <option value={Species.SouthernElephantSeal}>Southern Elephant Seal</option>,
                                        <option value={Species.StellerSeaLion}>Steller Sea Lion</option>,
                                        <option value={Species.Unknown}>Unknown</option>,
                                    </select>
                                </div>
                                <div className="input-box">
                                    <label>Quantity <span className="required">(required)</span></label>
                                    <input className="input-field" type="number" placeholder="Enter quantity"
                                        value={quantity} min="1" max="1000"
                                        onChange={(e) => setQuantity(parseInt(e.target.value))} />
                                </div>
                                <div className="input-box">
                                    <label>Longitude <span className="required">(required)</span></label>
                                    <input className="input-field coordinates" type="number" step="any" placeholder="Enter your longitude" required
                                        min="-180" max="180"
                                        onChange={(e) => setLongitude(parseFloat(e.target.value))} />
                                </div>
                                <div className="input-box">
                                    <label>Latitude <span className="required">(required)</span></label>
                                    <input className="input-field coordinates" type="number" step="any" placeholder="Enter your latitude" required
                                        min="-90" max="90"
                                        onChange={(e) => setLatitude(parseFloat(e.target.value))} />
                                </div>
                                <div className="input-box" hidden={species !== Species.Orca}>
                                    <label>Orca Type</label>
                                    <select className="input-field" onChange={(e) => { setOrcaType(parseInt(e.target.value)); }} defaultValue={0}>
                                        <option value={0}>N/A</option>,
                                        <option value={OrcaType.NorthernResident}>Northern Resident</option>,
                                        <option value={OrcaType.Offshore}>Offshore</option>,
                                        <option value={OrcaType.SouthernResident}>Southern Resident</option>,
                                        <option value={OrcaType.Transient}>Transient</option>,
                                    </select>
                                </div>
                                <div className="input-box" hidden={species !== Species.Orca}>
                                    <label>Orca Pod</label>
                                    <input className="input-field" type="text" placeholder="Enter the orca pod"
                                        value={orcaPod}
                                        onChange={(e) => setOrcaPod(e.target.value)} />
                                </div>
                                <div className="input-box description">
                                    <label>Description</label>
                                    <input className="input-field" type="textarea" placeholder="Enter description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)} />
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="submit-button">Submit Sighting</button>
                    </form>
                    : <div>
                        <button className="submit-button" onClick={() => resetForm()}> Report Another Sighting</button>
                        <ShowResultMessage responseMessage={responseMessage} />
                    </div>
                }
            </div>
        </div>
    );
}
