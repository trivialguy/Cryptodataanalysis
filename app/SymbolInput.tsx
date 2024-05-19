import React, { useState } from 'react';
import Autosuggest from 'react-autosuggest';
import { debounce } from 'lodash';

const SymbolInput = ({ onSymbolSelect }: { onSymbolSelect: (symbol: string) => void }) => {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const fetchSuggestions = async (value: string) => {
    const res = await fetch(`/api/hello3/${value}`);
    const result = await res.json();
    console.log(result);
    setSuggestions(result);
  };

  const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);

  const onChange = (event: React.FormEvent<HTMLElement>, { newValue }: Autosuggest.ChangeEvent) => {
    setValue(newValue);
  };

  const onSuggestionsFetchRequested = ({ value }: { value: string }) => {
    debouncedFetchSuggestions(value);
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onSuggestionSelected = (
    event: React.FormEvent<any>,
    { suggestion }: { suggestion: { symbol: string } }
  ) => {
    onSymbolSelect(suggestion.symbol);
  };

  const getSuggestionValue = (suggestion: { symbol: string }) => suggestion.symbol;

  const renderSuggestion = (suggestion: { symbol: string, description: string }) => (
    <div>
      {suggestion.symbol} - {suggestion.description}
    </div>
  );

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      onSuggestionSelected={onSuggestionSelected}
      inputProps={{
        placeholder: 'Enter symbol',
        value,
        onChange: onChange
      }}
    />
  );
};

export default SymbolInput;
