import React from 'react';
import ModalComponent from './Modal';
import SwitcheableColumnsList from './SwitcheableColumnsList';

import { Paper, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';

import onMobileOnDsk from '../utils/onMobileOnDsk';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
        overflow: 'hidden'
    },
    titleDsk: {
        ...onMobileOnDsk(
            {
                display: 'none'
            },
            {
                display: 'block'
            },
            theme
        ),
    },
    titleMbl: {
        ...onMobileOnDsk(
            {
                display: 'block'
            },
            {
                display: 'none'
            },
            theme
        ),
    },
    modal: {
        ...onMobileOnDsk(
            {},
            {
                height: '50%',
                width: '50%'
            },
            theme
        ),
        backgroundColor: 'lightgrey',
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(5),
        justifyContent: 'center',
        alignItems: 'center',
    }
}));

// eslint-disable-next-line react/prop-types
export default function ColumnEditorModal({headers, unusedHeaders, open, onClose}) {
    const [currentHeaders, setCurrentHeaders] = React.useState(headers);
    const styles = useStyles();
    return (
        <ModalComponent 
            handleClose={() => {onClose();}}
            open={open}>
            <Paper className={styles.modal}
                elevation={6} square >
                <Typography 
                    className={styles.titleDsk}
                    color='primary'
                    variant="h4"
                >
                    Editar las Columnas del Listado
                </Typography>
                <Typography
                    className={styles.titleMbl}
                    color='primary'
                    variant="h6"
                >
                    Editar las Columnas del Listado
                </Typography>
                <SwitcheableColumnsList
                    unusedHeaders={unusedHeaders}
                    currentHeaders={currentHeaders}
                    setCurrentHeaders={setCurrentHeaders}
                />
                <Button
                    color="primary"
                    variant="contained"
                    onClick={() => onClose(currentHeaders)}>
                        Cerrar y Guardar
                </Button>
            </Paper>
        </ModalComponent>
    );
}