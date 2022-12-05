import React, { useEffect } from "react";
import { navigate } from "gatsby";

import { Router } from "@reach/router";

import PrivateRoute from "../components/privateRoute";

const BounceToHome = () => {
  useEffect(() => {
    navigate("/", { replace: true });
  }, []);
  return null;
};

const App = () => {
  return (
    <Router basepath="/app">
      <PrivateRoute />
      <BounceToHome default />
    </Router>
  );
};

export default App;
