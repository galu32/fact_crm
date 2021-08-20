import React from 'react';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import clsx from 'clsx';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DrawerIconItem from './DrawerIconItem';
import DrawerCollapsableItem from './DrawerCollapsableItem';

import { List, Divider, Typography, IconButton, Drawer } from '@material-ui/core';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
}));

/*MENU*/
import MenuConfig from '../src/snapshots/Menu';
/*MENU*/

// eslint-disable-next-line react/prop-types
export default function DrawerComponent({open, setOpen}) {
    const classes = useStyles();
    const theme = useTheme();

    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <Drawer
            variant="permanent"
            className={clsx(classes.drawer, {
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open,
            })}
            classes={{
                paper: clsx({
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                }),
            }}
        >
            <div className={classes.toolbar}>
                <Typography variant="h6" noWrap>
        Bienvenido X!
                </Typography>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
            </div>
            <Divider />
            <List>
                {MenuConfig.map(({icon: Icon, name, options, to},inx) => (
                    <a key={inx}>
                        {options ? 
                            <DrawerCollapsableItem 
                                showTooltip={open} 
                                Icon={Icon} name={name}
                                options={options}/>
                            :  <DrawerIconItem 
                                to={to}
                                showTooltip={open} 
                                Icon={Icon}
                                name={name} />}
                    </a>
                ))}
            </List>
        </Drawer>
    );
}
