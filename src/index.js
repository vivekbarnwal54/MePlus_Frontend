import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter as Router} from 'react-router-dom';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <GoogleOAuthProvider clientId= {process.env.REACT_APP_GOOGLE_API_TOKEN} ><App /></GoogleOAuthProvider>
  </Router>
);

