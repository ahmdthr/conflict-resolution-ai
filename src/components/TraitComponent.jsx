import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';

const TraitComponent = ({ name, agentTraits, updateTraitChange, isLocked }) => {
  const handleAddTrait = () => {
    const updatedAgentTraits = {
      ...agentTraits,
      traits: [...agentTraits.traits, { traitName: '', value: 0.5 }],
    };
    updateTraitChange(name, updatedAgentTraits);
  };

  const handleTraitChange = (index, key, value) => {
    const updatedTraits = agentTraits.traits.map((trait, i) =>
      i === index ? { ...trait, [key]: value } : trait,
    );

    updateTraitChange(name, { ...agentTraits, traits: updatedTraits });
  };

  const handlePersonNameChange = (value) => {
    const updatedAgentTraits = {
      ...agentTraits,
      personName: value,
    };
    updateTraitChange(name, updatedAgentTraits);
  };

  const handleRemoveTrait = (index) => {
    const updatedTraits = agentTraits.traits.filter((_, i) => i !== index);
    updateTraitChange(name, { ...agentTraits, traits: updatedTraits });
  };

  return (
    <div className='p-4 max-w-md mx-auto'>
      <h2 className='text-xl font-bold mb-4'>Enter {name} Details</h2>

      <TextField
        type='text'
        className='border p-2 w-full mb-4'
        placeholder='Enter name'
        fullWidth={true}
        margin='normal'
        value={agentTraits.personName}
        disabled={isLocked}
        onChange={(e) => handlePersonNameChange(e.target.value)}
      />

      {agentTraits.traits?.map((trait, index) => (
        <div key={index} className='mb-4 p-2 border rounded'>
          <div className='flex justify-between items-center mb-2'>
            <TextField
              type='text'
              className='border p-2 w-full mr-2'
              placeholder='Trait name (e.g., courage)'
              value={trait.traitName}
              size='small'
              disabled={isLocked}
              onChange={(e) =>
                handleTraitChange(index, 'traitName', e.target.value)
              }
            />
            {!isLocked && (
              <button
                onClick={() => handleRemoveTrait(index)}
                className='text-red-600 hover:text-red-800 font-bold text-lg'
                title='Remove Trait'
              >
                ×
              </button>
            )}
          </div>
          <input
            type='range'
            min='0'
            max='1'
            step='0.01'
            value={trait.value}
            onChange={(e) => handleTraitChange(index, 'value', e.target.value)}
            className='w-full'
          />
          <div className='text-sm text-gray-700 mt-1'>
            Value: {parseFloat(trait.value).toFixed(2)}
          </div>
        </div>
      ))}

      {!isLocked && (
        <button
          onClick={handleAddTrait}
          className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
        >
          Add Character Trait
        </button>
      )}
    </div>
  );
};

export default TraitComponent;

TraitComponent.propTypes = {
  name: PropTypes.string.isRequired,
  agentTraits: PropTypes.shape({
    personName: PropTypes.string,
    traits: PropTypes.arrayOf(
      PropTypes.shape({
        traitName: PropTypes.string,
        value: PropTypes.number,
      }),
    ),
  }).isRequired,
  updateTraitChange: PropTypes.func.isRequired,
  isLocked: PropTypes.bool.isRequired,
};
