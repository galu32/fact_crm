import React from 'react';
import { useRouter } from 'next/dist/client/router';

import { Tooltip, Button, Menu, MenuItem, makeStyles, IconButton } from '@material-ui/core';
import onMobileOnDsk from '../utils/onMobileOnDsk';

import CloseIcon from '@material-ui/icons/Close';
import clsx from 'clsx';


const useStyles = makeStyles((theme) => ({
    containerDsk: {
        ...onMobileOnDsk(
            {
                display: 'none'
            },
            {
                display: 'flex'
            },
            theme,
        )
    },
    containerMbl: {
        ...onMobileOnDsk(
            {
                display: 'flex'
            },
            {
                display: 'none'
            },
            theme,
        )
    }
}));

// eslint-disable-next-line react/prop-types
export default function ToolbarActions({actions, closable, onClose, groupActions = true}) {
    const styles = useStyles();
    const router = useRouter();

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
        setAnchorEl(null);
    };

    const CloseIconWrapped = () => (closable || null) && (
        <Tooltip title="Cerrar">
            <CloseIcon
                onClick={() => {
                    onClose ? onClose() : router.back();
                }}
            /></Tooltip>
    );

    return (
        <div style={{
            marginLeft: 'auto'}}>
            <div className={clsx({[styles.containerDsk]: groupActions})} >
                {[...actions, 
                    <CloseIconWrapped key='close'/>].map((action,inx) => (
                    <a key={inx}
                        style={{margin: '0 3px'}}>
                        {<IconButton color="secondary">{action}</IconButton>}
                    </a>
                ))}
            </div>
            {groupActions && <div className={styles.containerMbl} >
                <Button
                    color="inherit"
                    variant="contained"
                    onClick={handleClick}>
                    Acciones
                </Button>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    {[...actions, 
                        <CloseIconWrapped key='close'/>].map((action,inx) => (
                        <MenuItem key={inx}>
                            <a onClick={handleClose}
                                style={{margin: '0 3px', color: '#566CD6'}}>
                                {<IconButton color="secondary">{action}</IconButton>}
                            </a>
                        </MenuItem>
                    ))}
                </Menu>
            </div>}
        </div>
    );
}