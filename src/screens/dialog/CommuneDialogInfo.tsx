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
        <Grid item>
          <Typography variant="body2">
            <FormattedMessage id="commune.code"/> : { commune.id }
          </Typography>
        </Grid>
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
          commune.area && (
            <Grid item>
              <Typography variant="body2">
                <FormattedMessage id="commune.area"/> : <FormattedNumber value={ commune.area }/> km²
              </Typography>
            </Grid>
          )
        }
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
          commune.population && commune.population.birth && (
            <Grid item>
              <Typography variant='body2'>
                <FormattedMessage id='commune.birth' values={ { year: Object.keys(commune.population.birth).slice(-1)[0] } }/> : <FormattedNumber
                value={ Object.values(commune.population.birth).slice(-1)[0] }/>
              </Typography>
            </Grid>
          )
        }
        {
          commune.population && commune.population.death && (
            <Grid item>
              <Typography variant='body2'>
                <FormattedMessage id='commune.death' values={ { year: Object.keys(commune.population.death).slice(-1)[0] } }/> : <FormattedNumber
                value={ Object.values(commune.population.death).slice(-1)[0] }/>
              </Typography>
            </Grid>
          )
        }
        {
          commune.population && commune.population.birthPerCapita && (
            <Grid item>
              <Typography variant="body2">
                <FormattedMessage id="commune.birthPerCapita" values={ {
                  year: Object.keys(commune.population.birthPerCapita)
                              .slice(-1)[0]
                } }/> : <FormattedNumber
                value={ Object.values(commune.population.birthPerCapita).slice(-1)[0] }/>
              </Typography>
            </Grid>
          )
        }
        {
          commune.population && commune.population.deathPerCapita && (
            <Grid item>
              <Typography variant="body2">
                <FormattedMessage id="commune.deathPerCapita" values={ {
                  year: Object.keys(commune.population.deathPerCapita)
                              .slice(-1)[0]
                } }/> : <FormattedNumber
                value={ Object.values(commune.population.deathPerCapita).slice(-1)[0] }/>
              </Typography>
            </Grid>
          )
        }
      </Grid>
    </CardContent>
  );
}

export default CommuneDialog;

