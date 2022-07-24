import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { AuthProvider } from "./Auth";
import PasswordReset from "./auth/PasswordReset";
import SignIn from "./auth/SignIn";
import SignUp from "./auth/SignUp";
import Home from "./home/Home";
import Notifications from "./notification/Notifications";
import PrivateRoute from "./PrivateRoute";
import SearchFounders from "./search/SearchFounders";
import SearchStartups from "./search/SearchStartups";
import CreateStartup from "./startupprofile/CreateStartup";
import ManageStartup from "./startupprofile/ManageStartup";
import MyStartup from "./startupprofile/MyStartup";
import StartupProfile from "./startupprofile/StartupProfile";
import CreateProfile from "./userprofile/CreateProfile";
import EditProfile from "./userprofile/EditProfile";
import ResponsiveProfile from "./userprofile/ResponsiveProfile";
import UserProfile from "./userprofile/UserProfile";

const App = () => {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Router>
          <PrivateRoute exact path="/profile" component={ResponsiveProfile} />
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
