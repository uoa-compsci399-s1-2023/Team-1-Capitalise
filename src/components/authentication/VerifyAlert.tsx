import { Snackbar, Alert } from '@mui/material'
import React from 'react'
import { useAuth } from '../../customHooks/useAuth'

export default function VerifyAlert() {

	const auth = useAuth();

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    auth.setOpenVerifyAlert(false);
  };

	return (
		<Snackbar open={auth.openVerifyAlert} onClose={handleClose}>
			<Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
				A verification link has been sent to your email! Please follow instructions in the email to finish the sign up process!
			</Alert>
		</Snackbar>
	)
}
