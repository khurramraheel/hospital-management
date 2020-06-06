import React from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './components/header/header';
import Dashboard from './components/dashboard/dashboard';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import Signup from './components/updateProfile/updateProfile';
import Appointment from './components/appointment/appointment';

import { checkUserSession } from './store/actions/auth';
import Home from './components/home/home';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import About from './components/about/about';

import Patients from './components/patients/patients';

import Contact from './components/contact/contact';

import {loadCategory} from './store/actions/category';

let checkedSession;

class App extends React.Component {

  // useEffect(() => {
  componentDidMount = () => {

    if (!checkedSession && this.props.store.auth.token != null) {
      checkedSession = true;
      this.props.checkUserSession(this.props.store.auth.token);

    } else {
      loadCategory({noToast:true});
    }
  }


  render = () => {

    return (
      <div className="App">

        <Header />

        <Route path="/contact" exact component={Contact} />

        <Route path="/about/:id" component={About} />
        <Route path="/" exact component={Home} />
        <Route path="/patients" exact component={Patients} />

        <Route path="/dashboard" component={Dashboard} />
        <Route path="/signup" component={Signup} />
        <Route path="/appointment" component={Appointment} />

        <ToastContainer />
      </div>
    );
  }
}

export default connect((store) => {

  return {
    store
  }

}, { checkUserSession })(App);
