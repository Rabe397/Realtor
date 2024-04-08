import React from 'react';
import {BrowserRouter as Router , Routes , Route} from 'react-router-dom';
import Home from './pages/Home';
import Offers from './pages/Offers';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import { ToastContainer} from 'react-toastify';
import CreateListing from './pages/CreateListing';
import EditListing from './pages/EditListing';
import ListingDetails from './pages/ListingDetails';

function App() {
  return (  
    <>
      <Router>
      <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/category/:categoryName/:listingId" element={<ListingDetails />} />
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/create-listing" element={<PrivateRoute />}>
            <Route path="/create-listing" element={<CreateListing />} />
          </Route>
          <Route path="/edit-listing" element={<PrivateRoute />}>
            <Route path="/edit-listing/:listingId" element={<EditListing />} />
          </Route>
        </Routes>
      </Router>
      <ToastContainer 
      position="top-left"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      
      />
    </>
  )
}

export default App;

