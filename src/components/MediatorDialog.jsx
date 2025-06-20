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

export const MediatorDialog = ({
  isDisabled,
  setMediatorDialogOpen,
  mediatorDialogOpen,
  dialogResponse,
  handleMediatorRequest,
  isLoading,
}) => (
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
          onClick={() => setMediatorDialogOpen(true)}
          className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700'
        >
          Ask AI
        </Button>
      </span>
    </Tooltip>
    &nbsp;&nbsp;
    <Dialog
      open={mediatorDialogOpen}
      onClose={() => setMediatorDialogOpen(false)}
      fullWidth
      maxWidth='sm'
    >
      <DialogTitle>Ask AI conflict resoluter</DialogTitle>
      <DialogContent>
        <TextField
          multiline
          fullWidth
          minRows={8}
          value={dialogResponse}
          InputProps={{ readOnly: true }}
          variant='outlined'
          margin='dense'
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleMediatorRequest}
          disabled={isDisabled || isLoading}
          color='primary'
          variant='contained'
        >
          Ask AI
        </Button>
        <Button
          onClick={() => setMediatorDialogOpen(false)}
          color='secondary'
          variant='outlined'
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  </div>
);

MediatorDialog.propTypes = {
  isDisabled: PropTypes.bool.isRequired,
  setMediatorDialogOpen: PropTypes.func.isRequired,
  mediatorDialogOpen: PropTypes.bool.isRequired,
  dialogResponse: PropTypes.string.isRequired,
  handleMediatorRequest: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};
