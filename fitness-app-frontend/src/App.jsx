import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react"
import { AuthContext } from "react-oauth2-code-pkce"
import { Button } from "@mui/material";
import { Box } from '@mui/material'
import { useDispatch } from "react-redux";
import { setCredentials } from "./store/authSlice";
import ActivityForm from "./assets/components/ActivityForm";
import ActivityList from "./assets/components/ActivityList";
import ActivityDetails from "./assets/components/ActivityDetails";


const ActivitiesPage = () => {
  return (<Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
    <ActivityForm onActivitiesAdded = {() => window.location.reload()}/>
    <ActivityList />
  </Box>);
}
function App() {
  const { token, tokenData, logIn, logOut, isAuthenticated } = useContext(AuthContext);
  const dispatch =useDispatch();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
  if (token && tokenData) {
    dispatch(setCredentials({ token, user: tokenData }));
    setAuthReady(true);
  }
}, [token, tokenData, dispatch]);

  return (
    <Router>
      {!token ? (
      <Button variant="contained" color="secondary"
              onClick={() => {
                logIn();
              }}> LOGIN </Button>
      ) : (
        // <div>
        //   <pre>{JSON.stringify(tokenData, null, 2)}</pre>
        //   <pre>{JSON.stringify(token, null, 2)}</pre>
        // </div>

        <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
           <Button variant="contained" color="secondary" onClick={logOut}>
            Logout
           </Button>
        <Routes>
          <Route path="/activities" element={<ActivitiesPage />}/>
          <Route path="/activities/:id" element={<ActivityDetails />}/>

          <Route path="/" element={token ? <Navigate to="/activities" replace/> : <div>Welcome! Please  Login.</div>} />
        </Routes>
    </Box>
      )}
    </Router>
  )
}


export default App;
