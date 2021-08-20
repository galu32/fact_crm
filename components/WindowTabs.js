/* eslint-disable react/prop-types */
import React from 'react';
import {Tabs, Tab, Divider} from '@material-ui/core';

// eslint-disable-next-line react/prop-types
export default function WindowTabs({currentTab, handleChange, currentWindow}) {

    const getTabs = () => {
        let allTabs = [];
        if (currentWindow) {
            const {tabs, matrixes} = currentWindow.getDescription();
            if (tabs && Object.keys(tabs).length > 0) 
                allTabs = Object.keys(tabs);
            if (matrixes && Object.keys(matrixes).length > 0){
                allTabs = [...allTabs, ...Object.keys(matrixes)];
            }
            return allTabs;
        }
        return allTabs;
    };

    return (
        <>
            <Tabs
                scrollButtons='on'
                variant="scrollable"
                value={currentTab}
                indicatorColor="primary"
                textColor="primary"
                onChange={(_, ix) => handleChange(getTabs()[ix], ix)}
            >
                {
                    getTabs().map(tab => (
                        <Tab key={tab} label={tab} />
                    ))
                }
            </Tabs>
            <Divider />
        </>
    );
}