import { CardContent, Grid, Typography } from '@mui/material';
import { useContext } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { DataContext } from 'screens/map/MapPage';
import { Departement } from 'types/api.types';

interface DepartementDialogInfoProps {
  departement: Departement;
}

function DepartementDialogInfo({ departement }: DepartementDialogInfoProps) {
  const data = useContext(DataContext);

  if (!data) {
    return <></>;
  }

  return (
    <CardContent>
      <Grid container rowSpacing={ 1 } flexDirection="column">
        <Grid item>
          <Typography variant="body2">
            <FormattedMessage id="departement.code"/> : { departement.id }
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body2">
            <FormattedMessage
              id="departement.region"/> : { `${ data.regions[departement.region].name } (${ departement.region })` }
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body2">
            <FormattedMessage
              id="departement.chefLieu"/> : { `${ data.communes[departement.chefLieu].name } ${ data.communes[departement.chefLieu].zipCode ? `(${ data.communes[departement.chefLieu].zipCode })` : '' }` }
          </Typography>
        </Grid>
        {
          departement.area && (
            <Grid item>
              <Typography variant="body2">
                <FormattedMessage id="departement.area"/> : <FormattedNumber value={ departement.area }/> km²
              </Typography>
            </Grid>
          )
        }
        {
          departement.population && (
            <Grid item>
              <Typography variant="body2">
                <FormattedMessage id="departement.population"
                                  values={ {
                                    year: Object.keys(departement.population.population)
                                                .slice(-1)[0]
                                  } }/> : <FormattedNumber
                value={ Object.values(departement.population.population).slice(-1)[0] }/>
              </Typography>
            </Grid>
          )
        }
        {
          departement.population && departement.population.density && (
            <Grid item>
              <Typography variant="body2">
                <FormattedMessage id="departement.density" values={ {
                  year: Object.keys(departement.population.density)
                              .slice(-1)[0]
                } }/> : <FormattedNumber
                value={ Object.values(departement.population.density).slice(-1)[0] }/> habitants/km²
              </Typography>
            </Grid>
          )
        }
        {
          departement.population && departement.population.birth && (
            <Grid item>
              <Typography variant="body2">
                <FormattedMessage id="departement.birth" values={ {
                  year: Object.keys(departement.population.birth)
                              .slice(-1)[0]
                } }/> : <FormattedNumber
                value={ Object.values(departement.population.birth).slice(-1)[0] }/>
              </Typography>
            </Grid>
          )
        }
        {
          departement.population && departement.population.death && (
            <Grid item>
              <Typography variant="body2">
                <FormattedMessage id="departement.death" values={ {
                  year: Object.keys(departement.population.death)
                              .slice(-1)[0]
                } }/> : <FormattedNumber
                value={ Object.values(departement.population.death).slice(-1)[0] }/>
              </Typography>
            </Grid>
          )
        }
        {
          departement.population && departement.population.birthPerCapita && (
            <Grid item>
              <Typography variant="body2">
                <FormattedMessage id="departement.birthPerCapita" values={ {
                  year: Object.keys(departement.population.birthPerCapita)
                              .slice(-1)[0]
                } }/> : <FormattedNumber
                value={ Object.values(departement.population.birthPerCapita).slice(-1)[0] }/>
              </Typography>
            </Grid>
          )
        }
        {
          departement.population && departement.population.deathPerCapita && (
            <Grid item>
              <Typography variant="body2">
                <FormattedMessage id="departement.deathPerCapita" values={ {
                  year: Object.keys(departement.population.deathPerCapita)
                              .slice(-1)[0]
                } }/> : <FormattedNumber
                value={ Object.values(departement.population.deathPerCapita).slice(-1)[0] }/>
              </Typography>
            </Grid>
          )
        }
      </Grid>
    </CardContent>
  );
}

export default DepartementDialogInfo;

