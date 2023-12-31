import { CardContent, Grid, Typography } from '@mui/material';
import { useContext } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { DataContext } from 'screens/map/MapPage';
import { Region } from 'types/api.types';

interface RegionDialogInfoProps {
  region: Region;
}

function RegionDialogInfo({ region }: RegionDialogInfoProps) {
  const data = useContext(DataContext);

  if (!data) {
    return <></>;
  }

  return (
    <CardContent>
      <Grid container rowSpacing={ 1 } flexDirection="column">
        <Grid item>
          <Typography variant="body2">
            <FormattedMessage id="region.code"/> : { region.id }
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body2">
            <FormattedMessage
              id="region.chefLieu"/> : { `${ data.communes[region.chefLieu].name } ${ data.communes[region.chefLieu].zipCode ? `(${ data.communes[region.chefLieu].zipCode })` : '' }` }
          </Typography>
        </Grid>
        {
          region.area && (
            <Grid item>
              <Typography variant="body2">
                <FormattedMessage id="region.area"/> : <FormattedNumber value={ region.area }/> km²
              </Typography>
            </Grid>
          )
        }
        {
          region.population && region.population.population && (
            <Grid item>
              <Typography variant="body2">
                <FormattedMessage id="region.population" values={ {
                  year: Object.keys(region.population.population).slice(-1)[0]
                } }/> : <FormattedNumber
                value={ Object.values(region.population.population).slice(-1)[0] }/>
              </Typography>
            </Grid>
          )
        }
        {
          region.population && region.population.density && (
            <Grid item>
              <Typography variant="body2">
                <FormattedMessage id="region.density" values={ {
                  year: Object.keys(region.population.density)
                              .slice(-1)[0]
                } }/> : <FormattedNumber
                value={ Object.values(region.population.density).slice(-1)[0] }/> habitants/km²
              </Typography>
            </Grid>
          )
        }
        {
          region.population && region.population.birth && (
            <Grid item>
              <Typography variant="body2">
                <FormattedMessage id="region.birth" values={ {
                  year: Object.keys(region.population.birth)
                              .slice(-1)[0]
                } }/> : <FormattedNumber
                value={ Object.values(region.population.birth).slice(-1)[0] }/>
              </Typography>
            </Grid>
          )
        }
        {
          region.population && region.population.death && (
            <Grid item>
              <Typography variant="body2">
                <FormattedMessage id="region.death" values={ {
                  year: Object.keys(region.population.death)
                              .slice(-1)[0]
                } }/> : <FormattedNumber
                value={ Object.values(region.population.death).slice(-1)[0] }/>
              </Typography>
            </Grid>
          )
        }
        {
          region.population && region.population.birthPerCapita && (
            <Grid item>
              <Typography variant="body2">
                <FormattedMessage id="region.birthPerCapita" values={ {
                  year: Object.keys(region.population.birthPerCapita)
                              .slice(-1)[0]
                } }/> : <FormattedNumber
                value={ Object.values(region.population.birthPerCapita).slice(-1)[0] }/>
              </Typography>
            </Grid>
          )
        }
        {
          region.population && region.population.deathPerCapita && (
            <Grid item>
              <Typography variant="body2">
                <FormattedMessage id="region.deathPerCapita" values={ {
                  year: Object.keys(region.population.deathPerCapita)
                              .slice(-1)[0]
                } }/> : <FormattedNumber
                value={ Object.values(region.population.deathPerCapita).slice(-1)[0] }/>
              </Typography>
            </Grid>
          )
        }
      </Grid>
    </CardContent>
  );
}

export default RegionDialogInfo;

