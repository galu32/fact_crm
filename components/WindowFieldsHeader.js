/* eslint-disable react/prop-types */
import React from 'react';
import {makeStyles} from '@material-ui/core/styles';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import Field from './Field';
import onMobileOnDsk from '../utils/onMobileOnDsk';

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
        justifyContent: 'center',
        flexWrap: 'wrap',
        alignContent: 'flex-start',
        ...onMobileOnDsk({
            overflow: 'auto',
            maxHeight: '100%',
        }, {
            width: '100%',
            overflow: 'hidden',
            justifyContent: 'flex-start',
            paddingTop: '1%',
            paddingLeft: '4%',
        }, theme)
    },
}));

export default function WindowFieldsHeader({ addChevrons, currentWindow }) {
    const styles = useStyles();

    const getChevron = (left) => {
        if (!addChevrons) return null;
        return (
            <div className={styles.chevrons}>
                {left ? <ChevronLeftIcon 
                    style={{marginRight: 'auto'}} />
                    : <ChevronRightIcon 
                        style={{marginLeft: 'auto'}} />
                }
            </div>
        );
    };

    const getHeaders = () => currentWindow ? currentWindow.getHeaderFields() : [];

    return (
        <div 
            className={styles.root}>
            {getChevron(true)}
            <div className={styles.fieldContainer}>
                {
                    getHeaders().map(fieldDescription => 
                        (
                            <Field 
                                value={currentWindow.getRecord()[fieldDescription.fieldName]}
                                record={currentWindow.getRecord()}
                                currentWindow={currentWindow}
                                fieldDescription={fieldDescription}
                                key={fieldDescription.fieldName}
                            />
                        )
                    )
                }
            </div>
            {getChevron(false)}
        </div>
    );
}