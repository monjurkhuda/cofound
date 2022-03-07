import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./home/Home";
import EditProfile from "./userprofile/EditProfile";
import CreateProfile from "./userprofile/CreateProfile";
import SignIn from "./auth/SignIn";
import PasswordReset from "./auth/PasswordReset";
import SignUp from "./auth/SignUp";
import MyStartup from "./startupprofile/MyStartup";
import SearchFounders from "./search/SearchFounders";
import SearchStartups from "./search/SearchStartups";
import ManageStartup from "./startupprofile/ManageStartup";
import Notifications from "./notification/Notifications";
import UserProfile from "./userprofile/UserProfile";
import StartupProfile from "./startupprofile/StartupProfile";
import { AuthProvider } from "./Auth";
import PrivateRoute from "./PrivateRoute";
import CreateStartup from "./startupprofile/CreateStartup";

const App = () => {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Router>
          <PrivateRoute exact path="/editprofile" component={EditProfile} />
          <PrivateRoute exact path="/createprofile" component={CreateProfile} />
          <Route exact path="/signin" component={SignIn} />
          <Route exact path="/" component={Home} />
          <Route exact path="/passwordreset" component={PasswordReset} />
          <Route exact path="/signup" component={SignUp} />
          <PrivateRoute exact path="/mystartup" component={MyStartup} />
          <PrivateRoute
            exact
            path="/searchfounders"
            component={SearchFounders}
          />
          <PrivateRoute
            exact
            path="/searchstartups"
            component={SearchStartups}
          />
          <PrivateRoute exact path="/createstartup" component={CreateStartup} />
          <PrivateRoute exact path="/managestartup" component={ManageStartup} />
          <PrivateRoute exact path="/notifications" component={Notifications} />
          <PrivateRoute
            exact
            path="/users/:userid"
            component={UserProfile}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/startups/:startupid"
            component={StartupProfile}
          ></PrivateRoute>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
};

export default App;
