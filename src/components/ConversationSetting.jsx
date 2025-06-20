import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
export const ConversationSetting = ({
  conversationSetting,
  setConversationSetting,
  conversationScenario,
  setConversationScenario,
  isLocked,
}) => {
  return (
    <div className='p-4 max-w-md mx-auto'>
      <h2 className='text-xl font-bold mb-4'>
        &nbsp;&nbsp;Enter conversation setting.
      </h2>
      <div className='flex flex-col items-center'>
        &nbsp;&nbsp;
        <TextField
          type='text'
          style={{ width: 700 }}
          className='border p-2 w-full mb-4'
          placeholder="Enter conversation setting e.g., 'Workplace disagreement'"
          value={conversationSetting}
          disabled={isLocked}
          onChange={(e) => setConversationSetting(e.target.value)}
        />
      </div>
      <h2 className='text-xl font-bold mb-4'>
        &nbsp;&nbsp;Enter conversation scenario.
      </h2>
      <div className='flex flex-col items-center'>
        &nbsp;&nbsp;
        <TextField
          type='text'
          style={{ width: 700 }}
          className='border p-2 w-full mb-4'
          placeholder="Enter whole conversation scenario e.g., 'A and B are arguing about a project deadline.'"
          value={conversationScenario}
          disabled={isLocked}
          onChange={(e) => setConversationScenario(e.target.value)}
        />
      </div>
    </div>
  );
};

ConversationSetting.propTypes = {
  conversationSetting: PropTypes.string.isRequired,
  setConversationSetting: PropTypes.func.isRequired,
  conversationScenario: PropTypes.string.isRequired,
  setConversationScenario: PropTypes.func.isRequired,
  isLocked: PropTypes.bool.isRequired,
};
