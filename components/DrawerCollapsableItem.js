import React from 'react';
import DrawerIconItem from './DrawerIconItem';
import { ListItem, Collapse } from '@material-ui/core';

// eslint-disable-next-line react/prop-types
export default function DrawerCollapsableItem ({Icon, name, options, showTooltip}) {
    const [collapsed, setCollapsed] = React.useState(true);
    return (
        <>
            <DrawerIconItem showTooltip={showTooltip} onClick={() => {
                setCollapsed(!collapsed);
            }} Icon={Icon} name={name}/>
            <Collapse in={!collapsed}>
                {options && Object.keys(options).map(option => (
                    <ListItem 
                        key={option}
                        alignItems="center" button>
                        {option}
                    </ListItem>
                ))
                }
            </Collapse>
        </>
    );
}