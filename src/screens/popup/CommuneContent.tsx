import { Close } from '@mui/icons-material';
import { CardContent, CardHeader, Divider, Grid, IconButton, Typography } from '@mui/material';
import { useContext } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { DataContext } from 'screens/map/MapPage';
import { Commune } from 'types/api.types';

interface CommuneContentProps {
  commune: Commune;
  onClose?: () => void;
}

function CommuneContent({ commune, onClose }: CommuneContentProps) {
  const data = useContext(DataContext);

  if (!data) {
    return <></>;
  }

  return (
    <>
      <CardHeader title={ `${ commune.name } ${ commune.zipCode ? `(${ commune.zipCode })` : '' }` }
                  action={ <IconButton onClick={ onClose }><Close/></IconButton> }/>
      <Divider/>
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
                id="commune.departement"/> : { `${ data.departements[commune.departement].name } (${ commune.departement })` }
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
          <Grid item>
            <Typography variant="body2">
              <FormattedMessage id="commune.code"/> : { commune.id }
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </>
  );
}

export default CommuneContent;

