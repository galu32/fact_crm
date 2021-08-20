import React from 'react';
import {makeStyles} from '@material-ui/core/styles';

import { Paper, Typography } from '@material-ui/core';

import { MoreVert } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '45%',
        height: '45%',
        backgroundColor: '#D5D5D5',
        overflow: 'hidden',
        margin: theme.spacing(2.5),
        flexGrow: 1,
        flexDirection: 'column',
        display: 'flex',
    },
    title: {
        height: '15%',
        width: '100%',
        backgroundColor: '#D5D5D5',
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(3)
    },
    body: {
        height: '80%',
        width: '97%',
        display: 'flex',
        padding: theme.spacing(1),
        margin: 'auto'
    }
}));

// eslint-disable-next-line react/prop-types
export default function DashboardCard() {
    const styles = useStyles();

    return (
        <Paper className={styles.root}
            elevation={2} square >
            <Paper square elevation={3} className={styles.title}>
                <Typography variant="h4" color="primary">
                        Este es el title del Card
                </Typography>
                <MoreVert style={{
                    marginLeft: 'auto'
                }} color="primary" />
            </Paper>
            <Paper square elevation={6} className={styles.body}>
                <Typography variant="h4" color="primary">
                        Este es el body del Card
                </Typography>
            </Paper>
        </Paper>
    );
}