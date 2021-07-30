import React, { Fragment } from "react";
import {Redirect, Route} from "react-router-dom";
import AuthorizeRoute from "./components/api-authorization/AuthorizeRoute";
import Home from "./components/Home";
import Counter from "./components/Counter";
import FetchData from "./components/FetchData";
import { ApplicationPaths } from "./components/api-authorization/ApiAuthorizationConstants";
import ApiAuthorizationRoutes from "./components/api-authorization/ApiAuthorizationRoutes";
import {Profile} from "./components/Profile";
import { Footer } from "./components/Footer";
import Navbar from "./components/Navbar";
//import {LoginMenu} from "./components/api-authorization/LoginMenu.js";


function App(): JSX.Element {
    return (
        <Fragment>
            <Navbar />
            <Route exact path="/map" />
            <AuthorizeRoute exact path="/reportsighting" />
            <AuthorizeRoute exact path="/profile" component={Profile}/>
            <Route exact path="/login">
                <Redirect to={ApplicationPaths.Login} />
            </Route>
            <Route exact path="/register">
                <Redirect to={ApplicationPaths.Register} />
            </Route>
            <Route exact path="/logout">
                <Redirect to={{ pathname: `${ApplicationPaths.LogOut}`, state: { local: true } }} />
            </Route>
            <Route exact path="/weather" component={FetchData} />
            <Route exact path="/counter" component={Counter} />
            <Route path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
            <Route exact path="/" component={Home} />
            <Route exact path="/Home" component={Home} />
            <Footer />
        </Fragment>
    );
}

export default App;
