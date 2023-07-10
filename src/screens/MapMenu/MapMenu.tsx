import { Menu } from '@mui/icons-material';
import { Card, CardContent, CardHeader, Drawer, IconButton, IconButtonProps, styled } from '@mui/material';
import React, { useRef, useState } from 'react';
import { useMap } from 'react-map-gl';
import { Data } from 'types/api.types';

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
  data: Data;
}

function MapMenu({ data }: MapMenuProps) {
  const card = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const { main } = useMap();

  if (card.current) {
    console.log(card.current.clientWidth);
  }

  return (
    <>
      <Drawer
        sx={ {
          width: card.current?.offsetWidth ?? 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: card.current?.offsetWidth ?? 0,
            height: card.current?.offsetHeight ?? 0,
            overflow: 'hidden',
            boxSizing: 'border-box',
            borderRightColor: 'transparent',
            borderBottomRightRadius: 4
          },
        } }
        variant="persistent"
        anchor="left"
        open={ open }
      >
        <Card ref={ card } sx={ { position: 'absolute', zIndex: 2 } }>
          <CardHeader title="Menu" sx={ { padding: 1 } }/>
          <CardContent sx={ { padding: 1 } }>
            Super menu
          </CardContent>
        </Card>
      </Drawer>
      <DrawerButton left={ open && card.current ? card.current.offsetWidth : 0 } open={ open }
                    onClick={ () => setOpen(!open) }>
        <Menu sx={ { fontSize: 24 } }/>
      </DrawerButton>
    </>
  );
}

export default MapMenu;

