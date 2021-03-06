import { CreateSightingApiModel } from "../../../api/models/CreateSightingApiModel";
import { Species } from "../../../api/ApiEnums";

test("check species enum works correctly", () => {
    const test: CreateSightingApiModel = {
        species: Species.AtlanticWhiteSidedDolphin,
        quantity: 2,
        description: "was nice",
        longitude: -100.010,
        latitude: -22.010,
        location: "atlantic ocean",
        sightedAt: new Date("July 30, 2021 16:00:00"),
        orcaType: null,
        orcaPod: ""
    };

    expect(test.species).toBe(1);
});

test("check orcaType nullable enum works correctly", () => {
    const test: CreateSightingApiModel = {
        species: Species.AtlanticWhiteSidedDolphin,
        quantity: 2,
        description: "was nice",
        longitude: -100.010,
        latitude: -22.010,
        location: "atlantic ocean",
        sightedAt: new Date("July 30, 2021 16:00:00"),
        orcaType: null,
        orcaPod: ""
    };

    expect(test.orcaType).toBe(null);
});