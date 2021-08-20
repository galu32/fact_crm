/* eslint-disable react/prop-types */
import React from 'react';
import {InputAdornment, TextField} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

import onMobileOnDsk from '../utils/onMobileOnDsk';
import { ArrowDownward} from '@material-ui/icons';
import PasteWindow from './PasteWindow';

const useStyles = makeStyles((theme) => ({
    field: {
        ...onMobileOnDsk({
            xs: {
                flexGrow: 1,
                width: '40%',
                maxWidth: '40%',
                margin: '8px 5px',
            },
            sm: {
                flexGrow: 1,
                maxWidth: '40%',
                width: '40%',
                margin: '11px 5px',
            }
        }, {
            width: '15%',
            margin: '8px 5px',
        }, theme)
    },
}));

const valueFormatter = (value, type) => {
    if (!value) return value;
    const v = String(value);
    switch(type) {
    case 'integer': {
        const regex = '^[0-9]*$';
        if (!v.match(regex)) {
            return v.slice(0, -1);
        }
        break;
    }
    case 'double': {
        const regex = '^[0-9,.]*$';
        if (!v.match(regex)) {
            return v.slice(0, -1);
        }
        let nv = v.replace(/,/g, '.');
        if (nv.includes('.')) {
            const splittedValue = nv.split('');
            console.log(splittedValue);
            const pointersQty = splittedValue.filter(x => x === '.');
            if (pointersQty.length > 1) {
                nv = splittedValue.join('').replace('.', '');
            }
        }
        return nv;
    }     
    }
    return v;
};

export default function Field({value,
    classname,
    disabled,
    currentWindow,
    record,
    fieldDescription = {},
}) {
    const styles = useStyles();

    const [currentValue, setCurrentValueW] = React.useState(value || '');

    const setCurrentValue = (value) => {
        setCurrentValueW(value);
        record.__fields__[fieldName] = value;
        record.setIsModified(true);
        record.__parent_class__?.setIsModified(true);
    };

    const [isDisabled, setIsDisabled] = React.useState(false);
    const [openPasteWindow, setOpenPasteWindow] = React.useState(false);

    const {fieldName, type, pasteWindow, pasteField} = fieldDescription;

    React.useEffect(() => {
        if (currentWindow) {
            currentWindow.fieldIsEditable(fieldName)
                .then(editable => {
                    setIsDisabled(!editable);
                });
            const _off = record.onFieldModified(fieldName, value => {
                const v2 = valueFormatter(value, type);
                if (v2 == value)
                    setCurrentValueW(v2);
            });
            return () => {
                _off();
            };
        }
    }, []);

    return (
        <>
            {
                pasteWindow && <PasteWindow 
                    pasteWindow={pasteWindow}
                    currentWindow={currentWindow}
                    open={openPasteWindow}
                    onRowClick={row => {
                        if (row[pasteField]) {
                            setCurrentValue(valueFormatter(row[pasteField], type));
                        }
                        setOpenPasteWindow(false);
                    }}
                /> 
            }
            <TextField 
                value={currentValue}
                onClick={() => {
                    if (pasteWindow)
                        setOpenPasteWindow(true);
                }}
                onChange={e => {
                    const formattedValue = valueFormatter(e.target.value, type);
                    setCurrentValue(formattedValue);
                }}
                disabled={disabled || isDisabled || Boolean(pasteWindow)}
                className={(classname || styles.field)}
                InputLabelProps={{
                    shrink: true,
                }}
                InputProps={{
                    ...(pasteWindow) ? {
                        endAdornment: (
                            <InputAdornment position="end">
                                <ArrowDownward color="primary" />
                            </InputAdornment>
                        )
                    } : {},
                }}
                label={fieldName}
            />
        </>
    );
}