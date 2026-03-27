'use client';

import React, { useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import { uniqueTrainNames } from '@/utils/trainNames';

const stripBracketContent = (name: string) => {
  return name.replace(/\s*\(.*?\)\s*/g, '').trim();
};

const SearchButton = () => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');

  const handleSelect = (_event: any, selectedValue: string | null) => {
    if (selectedValue) {
      const cleaned = stripBracketContent(selectedValue);
      const slug = cleaned.toLowerCase().replace(/\s+/g, '-');
      router.push(`/trains/${slug}`);
    }
  };

  return (
    <div className="mb-8 max-w-xl mx-auto">
      <Autocomplete
        disablePortal
        options={uniqueTrainNames}
        sx={{ width: '100%' }}
        inputValue={inputValue}
        onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
        onChange={handleSelect}
        renderInput={(params) => <TextField {...params} label="Search Train Name" variant="outlined" />}
      />
    </div>
  );
};

export default SearchButton;
