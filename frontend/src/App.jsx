import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Customize from "./components/Customize";
import { userDataContext } from "./context/UserContext";
import CustomizePage from "./pages/CustomizePage";

const App = () => {
  const { userData } = useContext(userDataContext);

  return (
    <Routes>
      <Route
        path="/"
        element={
          userData?.assistantImage && userData?.assistantName ? (
            <Home />
          ) : (
            <Navigate to={"/customize"} />
          )
        }
      />
      <Route
        path="/register"
        element={!userData ? <Register /> : <Navigate to={"/"} />}
      />
      <Route
        path="/login"
        element={!userData ? <Login /> : <Navigate to={"/"} />}
      />
      <Route
        path="/customize"
        element={userData ? <Customize /> : <Navigate to={"/login"} />}
      />
      <Route
        path="/customize-page"
        element={userData ? <CustomizePage /> : <Navigate to={"/register"} />}
      />
    </Routes>
  );
};

export default App;
