import { CardContent, Grid, Typography } from '@mui/material';
import { useContext } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { DataContext } from 'screens/map/MapPage';
import { Commune } from 'types/api.types';

interface CommuneContentProps {
  commune: Commune;
}

function CommuneDialog({ commune }: CommuneContentProps) {
  const data = useContext(DataContext);

  if (!data) {
    return <></>;
  }

  return (
    <CardContent>
      <Grid container rowSpacing={ 1 } flexDirection="column">
        {
          commune.zipCode && (
            <Grid item>
              <Typography variant="body2">
                <FormattedMessage
                  id="commune.zipCode"/> : { commune.zipCode }
              </Typography>
            </Grid>
          )
        }
        <Grid item>
          <Typography variant="body2">
            <FormattedMessage
              id="commune.departement"/> : { `${ data.common.departements.departements[commune.departement].name } (${ commune.departement })` }
          </Typography>
        </Grid>
        {
          commune.population && (
            <Grid item>
              <Typography variant='body2'>
                <FormattedMessage id='commune.population' values={ { year: Object.keys(commune.population.population).slice(-1)[0] } }/> : <FormattedNumber
                value={ Object.values(commune.population.population).slice(-1)[0] }/>
              </Typography>
            </Grid>
          )
        }
        {
          commune.population && commune.population.density && (
            <Grid item>
              <Typography variant='body2'>
                <FormattedMessage id='commune.density' values={ { year: Object.keys(commune.population.density).slice(-1)[0] } }/> : <FormattedNumber
                value={ Object.values(commune.population.density).slice(-1)[0] }/> habitants/km²
              </Typography>
            </Grid>
          )
        }
        {
          commune.area && (
            <Grid item>
              <Typography variant="body2">
                <FormattedMessage id="commune.area"/> : <FormattedNumber value={ commune.area }/> km²
              </Typography>
            </Grid>
          )
        }
        <Grid item>
          <Typography variant="body2">
            <FormattedMessage id="commune.code"/> : { commune.id }
          </Typography>
        </Grid>
      </Grid>
    </CardContent>
  );
}

export default CommuneDialog;

