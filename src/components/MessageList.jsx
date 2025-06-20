import React from 'react';
import PropTypes from 'prop-types';

export const MessageList = ({ messages }) => (
  <div className='space-y-4'>
    {messages
      .filter((msg) => msg.role !== 'system')
      .map((msg, idx) => (
        <div
          className={`chat-bubble`}
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            border: '2px solid white',
            borderRadius: '10px',
            margin: '10px',
          }}
          key={idx}
        >
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs md:max-w-md p-3 rounded-lg shadow-md ${msg.role === 'user' ? 'bg-green-200' : msg.role === 'assistant' ? 'bg-white' : 'bg-gray-200'}`}
            >
              <span className='text-base'>{msg.content}</span>
            </div>
          </div>
        </div>
      ))}
  </div>
);

MessageList.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      role: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
    }),
  ).isRequired,
};
