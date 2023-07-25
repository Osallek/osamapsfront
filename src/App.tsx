import { useEffect } from 'react';
import ReactGA from "react-ga4";
import { BrowserRouter } from 'react-router-dom';
import AppRouter from 'routers/AppRouter';
import 'maplibre-gl/dist/maplibre-gl.css';
import './App.css';

function App() {

  useEffect(() => {
    ;(async () => {
      ReactGA.initialize("G-TVWE7KFXTZ");
    })();
  }, []);

  return (
    <BrowserRouter>
      <AppRouter/>
    </BrowserRouter>
  );
}

export default App;
