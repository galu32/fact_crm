import React from 'react';
import {makeStyles} from '@material-ui/core/styles';

import DashboardCard from '../components/DashboardCard';

import { Paper } from '@material-ui/core';


const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        flexWrap: 'wrap',
        flexGrow: 1,
    },
}));

// eslint-disable-next-line react/prop-types
export default function Index({setToolbarTitle, setToolbarActions}) {
    const styles = useStyles();

    React.useEffect(() => {
        setToolbarTitle('Dashboard');
        setToolbarActions([], false);
    }, []);

    return (
        <>
            <Paper className={styles.root}
                elevation={6} square >
                {[...Array(10).keys()].map((i) => <DashboardCard key={i} />)}
            </Paper>
        </>
    );
}