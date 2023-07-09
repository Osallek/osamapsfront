import { Close } from '@mui/icons-material';
import { CardContent, CardHeader, Divider, Grid, IconButton, Typography } from '@mui/material';
import { useContext } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { DataContext } from 'screens/map/MapPage';
import { Departement } from 'types/api.types';

interface DepartementContentProps {
  departement: Departement;
  onClose?: () => void;
}

function DepartementContent({ departement, onClose }: DepartementContentProps) {
  const data = useContext(DataContext);

  if (!data) {
    return <></>;
  }

  return (
    <>
      <CardHeader title={ `${ departement.name } (${ departement.id })` }
                  action={ <IconButton onClick={ onClose }><Close/></IconButton> }/>
      <Divider/>
      <CardContent>
        <Grid container rowSpacing={ 1 } flexDirection='column'>
          <Grid item>
            <Typography variant='body2'>
              <FormattedMessage
                id='departement.region'/> : { `${ data.regions[departement.region].name } (${ departement.region })` }
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant='body2'>
              <FormattedMessage
                id='departement.chefLieu'/> : { `${ data.communes[departement.chefLieu].name } (${ departement.chefLieu })` }
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant='body2'>
              <FormattedMessage id='departement.area'/> : <FormattedNumber value={ departement.area }/> km²
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant='body2'>
              <FormattedMessage id='departement.code'/> : { departement.id }
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </>
  );
}

export default DepartementContent;

