import { Autocomplete, FilterOptionsState, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Api, Commune } from 'types/api.types';

function stripDiacritics(string: string) {
  return typeof string.normalize !== 'undefined'
    ? string.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    : string;
}

interface MenuSearchProps {
  data: Api;
  onChange: (commune: Commune | undefined) => void;
}

function MenuSearch({ data, onChange }: MenuSearchProps) {
  const [communes, setCommunes] = useState<Array<Commune>>([]);
  const [commune, setCommune] = useState<Commune | undefined>(undefined);

  useEffect(() => {
    setCommunes(Object.values(data.common.communes.communes).sort((a, b) => a.name.localeCompare(b.name)));
  }, [data]);

  useEffect(() => {
    //Todo moveTo
  }, [commune]);

  return (
    <Autocomplete
      sx={ { mb: 1, mt: 1, minWidth: 230 } }
      disablePortal
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      disableListWrap
      options={ communes }
      value={ commune ?? null }
      getOptionLabel={ option => `${ option.name }${ option.zipCode ? ` (${ option.zipCode })` : '' }` }
      groupBy={ option => option.name.slice(0, 1).toUpperCase() }
      getOptionDisabled={ option => option.point === undefined }
      noOptionsText={ <FormattedMessage id="common.notFound"/> }
      renderInput={ (params) => <TextField { ...params } label={ <FormattedMessage id="common.search"/> }/> }
      filterOptions={ (options: Commune[], { inputValue, getOptionLabel }: FilterOptionsState<Commune>) => {
        let input = inputValue.trim();

        input = input.toLowerCase();
        input = stripDiacritics(input);

        const filteredOptions: Commune[] = !input ? options
          : options.filter((option) => {
            let candidate = getOptionLabel(option);
            candidate = candidate.toLowerCase();
            candidate = stripDiacritics(candidate);

            return candidate.indexOf(input) > -1;
          });

        return filteredOptions.slice(0, 100);
      } }
      onChange={ (event: any, newValue: Commune | null) => {
        setCommune(newValue ?? undefined);
        onChange.call(undefined, newValue ?? undefined);
      } }
      onInputChange={ (event, value, reason) => {
        console.log(value);
        console.log(reason);
      } }
    />
  );
}

export default MenuSearch;

