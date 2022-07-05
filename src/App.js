import './App.css';
import { useEffect, useState } from 'react';
import Header from './common/header/Header';
import Map from './component/map/Map';
import { Grid, Backdrop } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Tree from './component/layers/Tree';
import { DxfProvider } from './common/context/DxfContext';

function App() {

  const [open, setOpen] = useState(false);

  return (
    <DxfProvider>
      <div className="App">
        <Header setOpen={setOpen} />
        <Grid container className='GridContainer'>
          <Grid item xs={6}>
            <Map />
          </Grid>
          <Grid item xs={6}>
            <Tree />
          </Grid>
        </Grid>
      </div>
      <Backdrop open={open}>
        <CircularProgress style={{ color: '#fff' }} />
      </Backdrop>
    </DxfProvider>
  );
}

export default App;
