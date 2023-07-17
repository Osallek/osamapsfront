import { CardContent, Grid, Typography } from '@mui/material';
import { Breakpoint } from '@mui/system';
import { useContext } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { DataContext } from 'screens/map/MapPage';
import { Commune } from 'types/api.types';

interface CommuneContentProps {
  commune: Commune;
  setMaxWidth?: (m: Breakpoint | false | undefined) => void;
}

function CommuneDialog({ commune, setMaxWidth }: CommuneContentProps) {
  const data = useContext(DataContext);

  if (!data) {
    return <></>;
  }

  if (setMaxWidth) {
    setMaxWidth(undefined);
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
              id="commune.departement"/> : { `${ data.departements.departements[commune.departement].name } (${ commune.departement })` }
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

