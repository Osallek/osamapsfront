import React, { useEffect, useState } from 'react';
import { Tooltip, YAxisProps } from 'recharts';
import YearLine from 'screens/dialog/YearLine';
import { Commune, Departement, Region } from 'types/api.types';

interface DialogPopProps {
  node: Region | Departement | Commune;
  mapper: (node: Region | Departement | Commune) => Array<any>;
  lines?: Array<any>;
  yAxis?: Array<YAxisProps>;
  tooltip?: React.ReactNode;
}

function DialogLine({ node, mapper, lines, yAxis, tooltip }: DialogPopProps) {
  const [data, setData] = useState<Array<any>>([]);

  useEffect(() => {
    setData(mapper.call(undefined, node));
  }, [mapper, node]);

  return (
    <YearLine data={ data } lines={ lines } yAxis={ yAxis }
              tooltip={ tooltip ? tooltip :
                <Tooltip content={ ({ active, payload, label }) => {
                  return active ? (
                    <div>
                      { `${ label } : ${ payload ? payload[0].value : '' }` }
                    </div>
                  ) : undefined;
                } }/> }/>
  );
}

export default DialogLine;

