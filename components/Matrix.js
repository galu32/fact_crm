/* eslint-disable react/prop-types */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

import { Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, CircularProgress } from '@material-ui/core';

import Field from './Field';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        height: '89%',
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
    }
}));


export default function Matrix({currentWindow, matrixName}) {
    const classes = useStyles();

    const getMatrixFields = () => currentWindow ? currentWindow.getFieldsForMatrix(matrixName) : [];

    const [loading, setLoading] = React.useState(false);
    const [headers,] = React.useState(getMatrixFields());
    const [rows, setRows] = React.useState([]);

    const addRow = () => {
        setLoading(true);
        currentWindow.canAddRow(matrixName)
            .then(value => {
                if (value) {
                    const record = currentWindow.getRecord();
                    const row = record[matrixName].addRow();
                    setRows([...rows, row]);
                }
                setLoading(false);
            });
    };

    const deleteRow = (row, index) => {
        setLoading(true);
        currentWindow.canDeleteRow(matrixName, row, index)
            .then(value => {
                if (value) {
                    const record = currentWindow.getRecord();
                    record[matrixName].removeRow(index);
                    setRows([...record[matrixName].getRows()]);
                }
                setLoading(false);
            });
    };

    React.useEffect(() => {
        if (currentWindow) {
            const record = currentWindow.getRecord()[matrixName];
            setRows([...record.getRows()]);
            const _off = currentWindow.onWindowReload(() => {
                const record = currentWindow.getRecord();
                setRows([...record[matrixName].getRows()]);
            });
            return _off;
        }
    }, [currentWindow]);

    return (
        <div className={classes.root}>
            <TableContainer className={classes.container} component={Paper}>
                { loading ? <CircularProgress/>
                    :
                    <Table className={classes.table} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">#</TableCell>
                                {
                                    headers.map(fieldDescription => (
                                        <TableCell key={`Header${fieldDescription.fieldName}`} align="center">{fieldDescription.fieldName}</TableCell>
                                    ))
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row, index) => (
                                <TableRow key={`Row${index}`}>
                                    <TableCell align="center">
                                        <DeleteIcon onClick={() => deleteRow(row,index)} />
                                    </TableCell>
                                    {
                                        headers.map(fieldDescription => (
                                            <TableCell key={`Row${index}-${fieldDescription.fieldName}`} align="center">
                                                <Field
                                                    record={row}
                                                    currentWindow={currentWindow}
                                                    fieldDescription={fieldDescription}
                                                    classname={classes.cellField}
                                                    value={row[fieldDescription.fieldName]} />
                                            </TableCell>
                                        ))
                                    }
                                </TableRow>
                            ))}
                            <TableRow style={{backgroundColor: 'grey'}}
                                onClick={addRow}>
                                <TableCell align="center">
                                    <AddIcon/>
                                </TableCell>
                                {
                                    headers.map(({fieldName}) => (
                                        <TableCell key={fieldName + 'BlankRow'} align="center">
                                            <Field 
                                                disabled
                                                classname={classes.cellField}/>
                                        </TableCell>
                                    ))
                                }
                            </TableRow>
                        </TableBody>
                    </Table>
                }
            </TableContainer>
        </div>
    );
}
