
import React, { Suspense, lazy } from 'react';
import ReactDOM from "react-dom";
import Spinner from 'react-spinkit';

import './reset.css';

import './index.css';

const HowMuch = lazy(()=>import('./HowMuch'));

function App(props) {
  return (
    <div>
      <Suspense fallback={
          <div className="center-container">
            <div>Loading application...</div>
            <div>
              <Spinner
                name="ball-grid-pulse"
                color="green"
                fadeIn="none"
              />
            </div>
          </div>
        }>
        <HowMuch/>
      </Suspense>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
