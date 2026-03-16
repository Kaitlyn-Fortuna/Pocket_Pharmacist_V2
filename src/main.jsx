import React from 'react'
import { Amplify } from "aws-amplify";
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "us-east-1_nESWAomhx",
      userPoolClientId: "35n5mj2g6io1gqj9pplcaekc6s",
      region: "us-east-1"
    }
  }
});


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
