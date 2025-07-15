import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "leaflet/dist/leaflet.css";

import { Provider } from "react-redux";
import { store } from "./store";
import { AuthProvider } from "./context/AuthContext";
import { GoogleOAuthProvider } from '@react-oauth/google';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="388412509046-mrahvht8tg4in6pt6538o36gtd4oba52.apps.googleusercontent.com">
    <Provider store={store}>
      <AuthProvider>
          <App /> 
      </AuthProvider>
    </Provider>
    </GoogleOAuthProvider>
  </StrictMode>
)
