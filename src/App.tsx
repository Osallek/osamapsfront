import { BrowserRouter } from 'react-router-dom';
import AppRouter from 'routers/AppRouter';
import './App.css';
import 'maplibre-gl/dist/maplibre-gl.css';

function App() {
  return (
    <BrowserRouter>
      <AppRouter/>
    </BrowserRouter>
  );
}

export default App;
