/* eslint-disable react/prop-types */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
    },
    container: {
        width: '95%',
        height: '93%',
        margin: 'auto',
        border: '1px solid #566CD6',
        padding: theme.spacing(1)
    },
    table: {
        minWidth: 850
    },
    cellField: {
        width: '100%'
    },
    row: {
        cursor: 'pointer'
    }
}));


export default function TableComponent({rows, headers, onRowClick}) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <TableContainer className={classes.container} component={Paper}>
                <Table 
                    className={classes.table}>
                    <TableHead>
                        <TableRow style={{
                            backgroundColor: 'lightgray'
                        }}>
                            {
                                headers.map(header => (
                                    <TableCell key={header} align="center">{header}</TableCell>
                                ))
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow 
                                onClick={() => onRowClick(row)}
                                className={classes.row}
                                key={`Row${index}`} hover>
                                {
                                    headers.map(header => (
                                        <TableCell key={`Row${index}-${header}`} align="center">
                                            {row[header]}
                                        </TableCell>
                                    ))
                                }
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
