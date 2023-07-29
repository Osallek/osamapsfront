import { Menu } from '@mui/icons-material';
import {
  Card, CardContent, Drawer, FormControl, FormControlLabel, FormLabel, Grid, IconButton, IconButtonProps, Radio,
  RadioGroup, styled
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useMap } from 'react-map-gl';
import MenuSearch from 'screens/MapMenu/MenuSearch';
import { AddressType, Api, Level, Point } from 'types/api.types';
import { DataView } from 'types/maps.types';
import { enumKeys } from 'utils/object.utils';

type DrawerButtonProps = IconButtonProps & {
  open: boolean;
  left: number;
}

const DrawerButton = styled(IconButton)<DrawerButtonProps>(
  ({ theme, open, left }) => ({
    zIndex: 2,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    borderRadius: '0 10px 10px 0',
    backgroundColor: 'white',
    position: 'absolute',
    '&:hover, &.Mui-focusVisible': { backgroundColor: 'white' },
    ...(open && {
      marginLeft: `${ left }px`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));

interface MapMenuProps {
  data: Api;
}

function MapMenu({ data }: MapMenuProps) {
  const card = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<boolean>(true);
  const { main } = useMap();
  const [view, setView] = useState<DataView>(DataView.SATELLITE);
  const [level, setLevel] = useState<Level>(Level.REGION);
  const [extra, setExtra] = useState<any>({});

  useEffect(() => {
    if (main && main.loaded()) {
      DataView.fill(view, level, data, main, extra);
    }
  }, [main, view, extra, level, data]);

  const onSearchChange = (point: Point | undefined, type: AddressType | undefined) => {
    if (main && main.loaded() && point && type) {
      let zoom;

      switch (type) {
        case AddressType.municipality:
        case AddressType.locality:
          zoom = 11;
          break;
        case AddressType.street:
          zoom = 16;
          break;
        case AddressType.housenumber:
          zoom = 18;
          break;
      }

      main.flyTo({ center: [point.lon, point.lat], zoom });
    }
  };

  return (
    <>
      <Drawer
        sx={ {
          width: card.current?.offsetWidth ?? 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: card.current?.offsetWidth ?? 0,
            overflowX: 'hidden',
            boxSizing: 'border-box',
            borderRightColor: 'transparent',
            borderBottomRightRadius: 4
          },
        } }
        variant="persistent"
        anchor="left"
        open={ open }
      >
        <Card ref={ card }
              sx={ { position: 'absolute', zIndex: 2, paddingLeft: 2, paddingRight: 2, minHeight: '100vh' } }>
          <CardContent sx={ { padding: 1 } }>
            <MenuSearch onChange={ onSearchChange }/>
            <FormControl fullWidth>
              <FormLabel>
                <FormattedMessage id="view.level"/>
              </FormLabel>
              <RadioGroup value={ level.valueOf() }
                          onChange={ e => setLevel(Level[e.target.value as keyof typeof Level]) }>
                {
                  enumKeys(Level).reverse().map(v => (
                    <React.Fragment key={ v }>
                      <FormControlLabel value={ v } control={ <Radio/> }
                                        label={ <FormattedMessage id={ `view.level.${ v }` }/> }
                                        sx={ { whiteSpace: 'nowrap' } }/>
                    </React.Fragment>
                  ))
                }
              </RadioGroup>
            </FormControl>
            <FormControl>
              <FormLabel>
                <FormattedMessage id="view.view"/>
              </FormLabel>
              <RadioGroup value={ view.valueOf() } onChange={ e => setView(Number(e.target.value)) }>
                {
                  Object.keys(DataView).filter(v => !isNaN(Number(v))).map(v => Number(v)).map(v => (
                    <React.Fragment key={ v }>
                      <FormControlLabel value={ v } control={ <Radio/> }
                                        label={ <FormattedMessage id={ `view.${ DataView[v] }` }/> }
                                        sx={ { whiteSpace: 'nowrap' } }/>
                      <Grid sx={ { marginLeft: 2 } }>
                        { view === v && DataView.subMenu(v, level, data, extra, setExtra) }
                      </Grid>
                    </React.Fragment>
                  ))
                }
              </RadioGroup>
            </FormControl>
          </CardContent>
        </Card>
      </Drawer>
      <DrawerButton left={ open && card.current ? card.current.offsetWidth : 0 } open={ open }
                    onClick={ () => setOpen(!open) }>
        <Menu sx={ { fontSize: 24 } }/>
      </DrawerButton>
    </>
  )
    ;
}

export default MapMenu;

