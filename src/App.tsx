import { BrowserRouter } from 'react-router-dom';
import AppRouter from 'routers/AppRouter';
import 'maplibre-gl/dist/maplibre-gl.css';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AppRouter/>
    </BrowserRouter>
  );
}

export default App;
