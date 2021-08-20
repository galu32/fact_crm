/* eslint-disable react/prop-types */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { Paper, Button, Checkbox, ListItemText, ListItemIcon,
    ListItem, List, Grid } from '@material-ui/core';

import onMobileOnDsk from '../utils/onMobileOnDsk';

//@@TODO en mobile deberia re order las listas y los button

const useStyles = makeStyles((theme) => ({
    root: {
        margin: 'auto',
    },
    paper: {
        ...onMobileOnDsk(
            {
                xs: {
                    height: 170,
                },
                sm: {
                    height: 170,
                    width: 200
                }
            },
            {
                md: {
                    height: 230,
                    width: 150
                },
                height: 230,
                width: 260
            },
            theme
        ),
        overflow: 'auto',
    },
    button: {
        margin: theme.spacing(0.5, 0),
    },
}));

function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

export default function SwitcheableColumnsList({currentHeaders, setCurrentHeaders, unusedHeaders}) {
    const classes = useStyles();
    const [checked, setChecked] = React.useState([]);
    const [right, setRight] = React.useState(unusedHeaders || []);

    const leftChecked = intersection(checked, currentHeaders);
    const rightChecked = intersection(checked, right);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const handleAllRight = () => {
        setRight(right.concat(currentHeaders));
        setCurrentHeaders([]);
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setCurrentHeaders(not(currentHeaders, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setCurrentHeaders(currentHeaders.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const handleAllLeft = () => {
        setCurrentHeaders(currentHeaders.concat(right));
        setRight([]);
    };

    const customList = (items) => (
        <Paper className={classes.paper}>
            <List dense component="div" role="list">
                {items.map((value) => {
                    const labelId = `transfer-list-item-${value}-label`;

                    return (
                        <ListItem key={value} role="listitem" button onClick={handleToggle(value)}>
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={value} />
                        </ListItem>
                    );
                })}
                <ListItem />
            </List>
        </Paper>
    );

    return (
        <>
            <Grid
                container
                spacing={2}
                justifyContent="center"
                alignItems="center"
                className={classes.root}
            >
                <Grid item>{customList(currentHeaders)}</Grid>
                <Grid item>
                    <Grid container direction="column" alignItems="center">
                        <Button
                            variant="outlined"
                            size="small"
                            className={classes.button}
                            onClick={handleAllRight}
                            disabled={currentHeaders.length === 0}
                            aria-label="move all right"
                        >
            ≫
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            className={classes.button}
                            onClick={handleCheckedRight}
                            disabled={leftChecked.length === 0}
                            aria-label="move selected right"
                        >
            &gt;
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            className={classes.button}
                            onClick={handleCheckedLeft}
                            disabled={rightChecked.length === 0}
                            aria-label="move selected left"
                        >
            &lt;
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            className={classes.button}
                            onClick={handleAllLeft}
                            disabled={right.length === 0}
                            aria-label="move all left"
                        >
            ≪
                        </Button>
                    </Grid>
                </Grid>
                <Grid item>{customList(right)}</Grid>
            </Grid>
        </>
    );
}
