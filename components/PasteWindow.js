/* eslint-disable react/prop-types */
import React from 'react';
import {makeStyles} from '@material-ui/core/styles';

import { AppBar, Paper, Toolbar } from '@material-ui/core';

import TableComponent from '../components/Table';
import ModalComponent from './Modal';
import ToolbarActions from './ToolbarActions';

const useStyles = makeStyles(() => ({
    root: {
        height: '100%',
        overflow: 'hidden'
    },
}));

// eslint-disable-next-line no-unused-vars
export default function PasteWindow({currentWindow, open, onRowClick, pasteWindow}) {
    const styles = useStyles();

    const [headers, setHeaders] = React.useState([]);
    const [rows, setRows] = React.useState([]);

    React.useEffect(() => {
        if (!currentWindow) return;
        currentWindow.getPasteWindowRows(pasteWindow)
            .then(rows => {
                if (Array.isArray(rows) && rows.length) {
                    setHeaders(Object.keys(rows[0]));
                    setRows(rows);
                }
            });
        return () => {
            setHeaders([]);
            setRows([]);
        };
    }, []);

    return (
        <>
            <ModalComponent handleClose={onRowClick} open={open}>
                <Paper className={styles.root}
                    elevation={6} square >
                    <AppBar position="relative">
                        <Toolbar>
                            <ToolbarActions 
                                actions={[]}
                                closable
                                onClose={onRowClick}
                                groupActions={false}
                            />
                        </Toolbar>
                    </AppBar>
                    <div style={{width: '100%', height: '92%'}}>
                        <TableComponent 
                            headers={headers}
                            rows={rows}
                            onRowClick={onRowClick} />
                    </div>
                </Paper>
            </ModalComponent>
        </>
    );
}