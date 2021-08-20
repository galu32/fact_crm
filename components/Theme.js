import React from 'react';
import Typography from '@material-ui/core/Typography';

import clsx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import { CircularProgress, Toolbar, AppBar } from '@material-ui/core';

import DrawerComponent from './Drawer';
import ToolbarActions from './ToolbarActions';
import ModalComponent from './Modal';

import onMobileOnDsk from '../utils/onMobileOnDsk';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        height: '100vh'
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {
        ...onMobileOnDsk({
            sm: {maxWidth: '85%'},
        }, {}, theme),
        flexGrow: 1,
        padding: theme.spacing(3),
        marginTop: theme.spacing(6),
    },
}));

import onRoutingLoading from '../utils/hooks/onRoutingLoading';

// eslint-disable-next-line react/prop-types
export default function Theme({getChild}) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const routeLoading = onRoutingLoading();

    const [toolbarTitle, setToolbarTitle] = React.useState('');
    const [toolbarActions, setToolbarActions] = React.useState([]);
    const [toolbarClosable, setToolbarClosable] = React.useState([]);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    return (
        <div className={classes.root}>
            <ModalComponent open={loading || routeLoading}>
                <CircularProgress />
            </ModalComponent>
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, {
                            [classes.hide]: open,
                        })}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        {toolbarTitle}
                    </Typography>
                    {!open && 
                        <ToolbarActions 
                            closable={toolbarClosable}
                            actions={toolbarActions} />
                    }
                </Toolbar>
            </AppBar>
            <DrawerComponent open={open} setOpen={setOpen} />
            <main className={classes.content}>
                {getChild({
                    setToolbarTitle,
                    setToolbarActions: (actions, closable = true) => {
                        setToolbarActions(actions);
                        setToolbarClosable(closable);
                    },
                    setLoading,
                })}
            </main>
        </div>
    );
}
