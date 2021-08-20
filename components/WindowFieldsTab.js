/* eslint-disable react/prop-types */
import React from 'react';
import {makeStyles} from '@material-ui/core/styles';

import Field from './Field';
import onMobileOnDsk from '../utils/onMobileOnDsk';
import Matrix from './Matrix';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        ...onMobileOnDsk({
            justifyContent: 'center',
        }, {
            alignItems: 'flex-start'
        }, theme)
    },
    chevrons: {
        width: '10%',
        ...onMobileOnDsk({
            display: 'flex',
        }, {
            display: 'none'
        }, theme)
    },
    fieldContainer: {
        width: '80%',
        height: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignContent: 'flex-start',
        ...onMobileOnDsk({
            overflow: 'auto',
            paddingLeft: '3%',
            maxHeight: '100%',
        }, {
            width: '100%',
            overflow: 'hidden',
            paddingTop: '1%',
            paddingLeft: '5%',
        }, theme)
    },
}));

export default function WindowFieldsTab({ tabName, currentWindow }) {
    const styles = useStyles();

    const getFields = () => currentWindow ? currentWindow.getFieldsForTab(tabName) : [];

    const isMatrix = () => currentWindow ? currentWindow.isMatrix(tabName) : false;

    return (
        <div 
            className={styles.root}>
            {
                getFields().length > 0 && 
                    <div className={styles.fieldContainer}>
                        {
                            getFields().map(fieldDescription => 
                                (
                                    <Field
                                        value={currentWindow.getRecord()[fieldDescription.fieldName]}
                                        record={currentWindow.getRecord()} 
                                        currentWindow={currentWindow}
                                        fieldDescription={fieldDescription}
                                        key={fieldDescription.fieldName} />
                                )
                            )
                        }
                    </div>
            }
            {
                isMatrix() &&
                    <Matrix 
                        currentWindow={currentWindow}
                        matrixName={tabName}
                    />
            }
        </div>
    );
}