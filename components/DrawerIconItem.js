/* eslint-disable react/prop-types */
import React from 'react';
import { ListItem, ListItemIcon, ListItemText, Tooltip } from '@material-ui/core';

import { useRouter } from 'next/dist/client/router';

export default function DrawerIconItem ({Icon, name, onClick, showTooltip, to}) {
    const router = useRouter();
    // eslint-disable-next-line react/display-name
    const IconWr = React.forwardRef((props, ref) => <Icon {...props} ref={ref} />);
    return (
        <ListItem onClick={(e) => {
            onClick && onClick(e);
            to && router.push(to);
        }} divider button>
            <ListItemIcon>
                {
                    !showTooltip ? 
                        <Tooltip title={name} placement="right-start">
                            <IconWr />
                        </Tooltip> 
                        : <IconWr />
                }
            </ListItemIcon>
            <ListItemText primary={name} />
        </ListItem>
    );  
}