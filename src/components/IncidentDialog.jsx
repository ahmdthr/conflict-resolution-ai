import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Tooltip,
} from '@mui/material';

export const IncidentDialog = ({
  isDisabled,
  setIncidentDialogOpen,
  incidentDialogOpen,
  incidentDialogText,
  handleIncidentDialogText,
  isLoading,
  addConflict,
}) => {
  incidentDialogText = incidentDialogText
    ? incidentDialogText.split('Here is the new scenario:')[1].trimStart()
    : '';
  return (
    <div className='mt-6'>
      <Tooltip
        enterDelay={500}
        leaveDelay={200}
        title={isDisabled ? 'Available after 6 messages' : ''}
      >
        <span>
          <Button
            variant='contained'
            disabled={isDisabled || isLoading}
            onClick={() => setIncidentDialogOpen(true)}
            className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700'
          >
            Introduce conflicting scenario
          </Button>
        </span>
      </Tooltip>

      <Dialog
        open={incidentDialogOpen}
        onClose={() => setIncidentDialogOpen(false)}
        fullWidth
        maxWidth='sm'
      >
        <DialogTitle>Add a conflicting scenario</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            fullWidth
            minRows={4}
            value={incidentDialogText}
            onChange={(e) => handleIncidentDialogText(e.target.value)}
            variant='outlined'
            margin='dense'
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={addConflict}
            disabled={isDisabled || isLoading}
            color='primary'
            variant='contained'
          >
            Add conflict
          </Button>
          <Button
            onClick={() => setIncidentDialogOpen(false)}
            color='secondary'
            variant='outlined'
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

IncidentDialog.propTypes = {
  isDisabled: PropTypes.bool.isRequired,
  setIncidentDialogOpen: PropTypes.func.isRequired,
  incidentDialogOpen: PropTypes.bool.isRequired,
  incidentDialogText: PropTypes.string.isRequired,
  handleIncidentDialogText: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  addConflict: PropTypes.func.isRequired,
};
