import React from 'react';
import PropTypes from 'prop-types';
import TraitComponent from './TraitComponent';

export const TraitConfigTable = ({ agentTraits, setAgentTraits, isLocked }) => {
  const handleTraitChange = (name, value) => {
    setAgentTraits((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div
      className='w-full flex flex-col gap-10 p-10'
      style={{ display: 'flex', padding: '10px' }}
    >
      <div className='flex flex-col items-center'>
        <TraitComponent
          name={'agentA'}
          agentTraits={agentTraits.agentA}
          updateTraitChange={handleTraitChange}
          isLocked={isLocked}
        />
      </div>
      {'     '}
      <div className='flex flex-col items-center'>
        <TraitComponent
          name={'agentB'}
          agentTraits={agentTraits.agentB}
          updateTraitChange={handleTraitChange}
          isLocked={isLocked}
        />
      </div>
    </div>
  );
};

TraitConfigTable.propTypes = {
  agentTraits: PropTypes.shape({
    agentA: PropTypes.object.isRequired,
    agentB: PropTypes.object.isRequired,
  }).isRequired,
  setAgentTraits: PropTypes.func.isRequired,
  isLocked: PropTypes.bool.isRequired,
};
