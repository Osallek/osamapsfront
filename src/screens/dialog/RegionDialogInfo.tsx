import { CardContent, Grid, Typography } from '@mui/material';
import { Breakpoint } from '@mui/system';
import { useContext } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { DataContext } from 'screens/map/MapPage';
import { Region } from 'types/api.types';

interface RegionDialogInfoProps {
  region: Region;
  setMaxWidth?: (m: Breakpoint | false | undefined) => void;
}

function RegionDialogInfo({ region, setMaxWidth }: RegionDialogInfoProps) {
  const data = useContext(DataContext);

  if (!data) {
    return <></>;
  }

  if (setMaxWidth) {
    setMaxWidth(undefined);
  }

  return (
    <CardContent>
      <Grid container rowSpacing={ 1 } flexDirection='column'>
        <Grid item>
          <Typography variant='body2'>
            <FormattedMessage
              id='region.chefLieu'/> : { `${ data.communes.communes[region.chefLieu].name } ${ data.communes.communes[region.chefLieu].zipCode ? `(${ data.communes.communes[region.chefLieu].zipCode })` : '' }` }
          </Typography>
        </Grid>
        {
          region.population && (
            <Grid item>
              <Typography variant='body2'>
                <FormattedMessage id='region.population' values={ { year: Object.keys(region.population.population).slice(-1)[0] } }/> : <FormattedNumber
                value={ Object.values(region.population.population).slice(-1)[0] }/>
              </Typography>
            </Grid>
          )
        }
        {
          region.area && (
            <Grid item>
              <Typography variant='body2'>
                <FormattedMessage id='region.area'/> : <FormattedNumber value={ region.area }/> km²
              </Typography>
            </Grid>
          )
        }
        <Grid item>
          <Typography variant='body2'>
            <FormattedMessage id='region.code'/> : { region.id }
          </Typography>
        </Grid>
      </Grid>
    </CardContent>
  );
}

export default RegionDialogInfo;

