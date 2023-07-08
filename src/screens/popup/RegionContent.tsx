import { Close } from '@mui/icons-material';
import { CardContent, CardHeader, Divider, Grid, IconButton, Typography } from '@mui/material';
import { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import { DataContext } from 'screens/map/MapPage';
import { Region } from 'types/api.types';

interface RegionContentProps {
  region: Region;
  onClose?: () => void;
}

function RegionContent({ region, onClose }: RegionContentProps) {
  const data = useContext(DataContext);

  if (!data) {
    return <></>;
  }

  return (
    <>
      <CardHeader title={ region.name } action={ <IconButton onClick={ onClose }><Close/></IconButton> }/>
      <Divider/>
      <CardContent>
        <Grid container rowSpacing={ 1 } flexDirection="column">
          <Grid item>
            <Typography variant="body2">
              <FormattedMessage
                id="region.chefLieu"/> : { `${ data.communes[region.chefLieu].name } (${ region.chefLieu })` }
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2">
              <FormattedMessage id="region.code"/> : { region.id }
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </>
  );
}

export default RegionContent;

