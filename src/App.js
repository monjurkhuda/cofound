import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./Home";
import EditProfile from "./EditProfile";
import CreateProfile from "./CreateProfile";
import SignIn from "./SignIn";
import PasswordReset from "./PasswordReset";
import SignUp from "./SignUp";
import MyStartup from "./MyStartup";
import SearchFounders from "./SearchFounders";
import SearchStartups from "./SearchStartups";
import ManageStartup from "./ManageStartup";
import Notifications from "./Notifications";
import UserProfile from "./UserProfile";
import StartupProfile from "./StartupProfile";
import { AuthProvider } from "./Auth";
import PrivateRoute from "./PrivateRoute";
import CreateStartup from "./CreateStartup";

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
