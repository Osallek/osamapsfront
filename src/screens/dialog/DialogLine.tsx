import React, { useEffect, useState } from 'react';
import { Tooltip } from 'recharts';
import YearLine from 'screens/dialog/YearLine';
import { Commune, Departement, Region } from 'types/api.types';

interface DialogPopProps {
  node: Region | Departement | Commune;
  mapper: (node: Region | Departement | Commune) => Array<any>;
}

function DialogLine({ node, mapper }: DialogPopProps) {
  const [data, setData] = useState<Array<any>>([]);

  useEffect(() => {
    setData(mapper.call(undefined, node));
  }, [node]);

  return (
    <YearLine data={ data }
              tooltip={ <Tooltip content={ ({ active, payload, label }) => {
                   return active ? (
                     <div>
                       { `${ label } : ${ payload ? payload[0].value : '' }` }
                     </div>
                   ) : undefined;
                 } }/> }/>
  );
}

export default DialogLine;

