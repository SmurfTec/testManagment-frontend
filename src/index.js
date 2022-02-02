// scroll bar
import 'simplebar/src/simplebar.css';

import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// * Styles for some packages ----------
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import 'react-toastify/dist/ReactToastify.css';

//*
import { ToastContainer } from 'react-toastify';
import App from './App';
import * as serviceWorker from './serviceWorker';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './Contexts/AuthContext';
import { AssetsProvider } from './Contexts/AssetsContext';
import { GamesProvider } from './Contexts/GamesContext';
import { DevRequestsProvider } from './Contexts/DevRequestsContext';
import { UsersProvider } from './Contexts/UsersContext';

// * -------------------------------
// ----------------------------------------------------------------------

ReactDOM.render(
  <HelmetProvider>
    <BrowserRouter>
      <ToastContainer
        position='top-right'
        autoClose={3000}
        hideProgressBar
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <AuthProvider>
        <AssetsProvider>
          <GamesProvider>
            <DevRequestsProvider>
              <UsersProvider>
                <App />
              </UsersProvider>
            </DevRequestsProvider>
          </GamesProvider>
        </AssetsProvider>
      </AuthProvider>
    </BrowserRouter>
  </HelmetProvider>,
  document.getElementById('root')
);

// If you want to enable client cache, register instead.
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
