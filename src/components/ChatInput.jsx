import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, TextField } from '@mui/material';

export const ChatInput = ({ onSend, onContinue, agentName, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput('');
  };

  return (
    <div className='flex w-full border rounded-lg overflow-hidden'>
      &nbsp;&nbsp;
      <TextField
        type='text'
        value={input}
        style={{ width: 700 }}
        sx={{
          border: '2px solid white',
          borderRadius: '10px',
          marginBottom: '100px',
        }}
        onChange={(e) => setInput(e.target.value)}
        placeholder='Type your message...'
        className='flex-grow px-4 py-3 text-base focus:outline-none'
      />
      &nbsp;&nbsp;
      <Button
        onClick={() => onContinue(false)}
        color='secondary'
        variant='outlined'
        disabled={isLoading}
      >
        Generate response as {agentName}
      </Button>
      <Button
        onClick={() => handleSubmit()}
        disabled={isLoading || !input.trim()}
        color='secondary'
        variant='outlined'
      >
        Send as {agentName}
      </Button>
    </div>
  );
};

ChatInput.propTypes = {
  onSend: PropTypes.func.isRequired,
  onContinue: PropTypes.func.isRequired,
  agentName: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
};
