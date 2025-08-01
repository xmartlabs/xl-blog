import * as React from 'react';
// import { navigate } from "gatsby"
//import { isLoggedIn } from "../services/auth"

const PrivateRoute = ({ component: Component, location, ...rest }) => {
  // if (!isLoggedIn() && location.pathname !== `/accounts/sign-in`) {
  //   navigate("/accounts/sign-in")
  //   return null
  // }
  return <Component {...rest} />;
};
export default PrivateRoute;
