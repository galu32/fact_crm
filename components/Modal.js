import React from 'react';
import { makeStyles } from '@material-ui/core';
import { Modal } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        padding: theme.spacing(1),
        alignItems: 'center',
        justifyContent: 'center',
    }
}));

// eslint-disable-next-line react/prop-types
export default function ModalComponent({open, handleClose, children}){
    const classes = useStyles();
    return (
        <Modal
            disablePortal
            disableEnforceFocus
            disableAutoFocus
            open={open}
            onClose={handleClose}
            className={classes.modal}
        >
            {children}
        </Modal>
    );
}