import React from 'react';

import { useRouter } from 'next/dist/client/router';

import {makeStyles} from '@material-ui/core/styles';

import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import RefreshIcon from '@material-ui/icons/Refresh';
import MailIcon from '@material-ui/icons/Mail';
import PrintIcon from '@material-ui/icons/Print';

import { Paper, Tooltip } from '@material-ui/core';

import WindowFieldsHeader from '../../../components/WindowFieldsHeader';
import WindowFieldsTab from '../../../components/WindowFieldsTab';
import WindowTabs from '../../../components/WindowTabs';

const useStyles = makeStyles(() => ({
    root: {
        height: '68%',
        width: '100%',
        overflow: 'hidden'
    },
}));

// eslint-disable-next-line react/prop-types
export default function Window({setToolbarTitle, setToolbarActions, setLoading}) {
    const styles = useStyles();
    const router = useRouter();

    const [currentTab, setCurrentTab] = React.useState({
        name: '', index: 0
    });

    const [currentWindow, setCurrentWindow] = React.useState(null);

    const asyncWrappedMethod = (promise) => {
        setLoading(true);
        promise.then(() => {
            setLoading(false);
        });
    };

    const save = async () => {
        const {ok, error} = await currentWindow.default.save();
        if (!ok) {
            return alert(error);
        }
        router.push({
            pathname: '/window/[record]/[internalId]',
            query: {
                record: router.query.record,
                internalId: currentWindow.default.__record__.internalId,
            }
        });
    };

    React.useEffect(() => {
        if (currentWindow) {
            const toolt = (t, c) => <Tooltip title={t}>{c}</Tooltip>;
            setToolbarActions([
                toolt('Imprimir', <PrintIcon key="print" />),
                toolt('Enviar por Correo', <MailIcon key="mail" />),
                toolt('Eliminar', <DeleteIcon key="delete" />),
                toolt('Guardar', <SaveIcon key="check" onClick={() => asyncWrappedMethod(save())} />),
                toolt('Refrescar', <RefreshIcon key="refresh" onClick={() => asyncWrappedMethod(currentWindow.default.reload())} />)
            ]);
            setInitialTab();
            setToolbarTitle(currentWindow.default.getDescription().title);
        }
    }, [currentWindow]);

    const setWindowObject = (w, r) => {
        Object.assign(window, {
            $w: w,
            $r: r,
        });
    };

    React.useEffect(() => {
        const {record, internalId} = router.query;
        if (!record || !internalId) return;
        if (internalId == currentWindow?.default.__record__?.internalId) return;
        setLoading(true);
        Promise.all([
            import('../../../src/window/' + record + 'Window.js'),
            import('../../../src/record/' + record + '.js')
        ]).then(([w, r]) => {
            if (!w || !r) {
                throw new Error('Incorrect path name');
            }
            w.default.bring(internalId, r.default).then(rec => {
                w.default.setRecord(rec);
                setWindowObject(w.default, w.default.getRecord());
                if (!rec.internalId) {
                    setCurrentWindow(null);
                }
                setCurrentWindow(w);
                setInitialTab();
                setLoading(false);
            }).catch(console.log);

        });
    }, [router.query.record, router.query.internalId]);

    React.useEffect(() => {
        return () => {
            setWindowObject(undefined, undefined);
        };
    }, [router.query.record]);

    const handleChange = (tabName, newValue) => {
        setCurrentTab({name: tabName, index: newValue});
    };

    const getCurrentTabByIndex = () => currentWindow?.default ?
        currentWindow.default.getTabNameByIndex(currentTab.index) : '';

    const setInitialTab = () => {
        if (currentWindow) {
            const {initialTab, tabs} = currentWindow.default.getDescription();
            if (initialTab && tabs) {
                setCurrentTab({
                    index: Object.keys(tabs).indexOf(initialTab),
                    name: initialTab
                });
            }
        }
    };

    return (
        <>
            <Paper 
                style={{
                    height: '30%'
                }}
                elevation={6} square >
                <WindowFieldsHeader 
                    currentWindow={currentWindow?.default} 
                />
            </Paper>
            <br/>
            <Paper 
                className={styles.root}
                elevation={6} square >
                <WindowTabs 
                    handleChange={handleChange}
                    currentTab={currentTab.index}
                    currentWindow={currentWindow?.default}
                />
                <WindowFieldsTab 
                    tabName={currentTab.name || getCurrentTabByIndex()}
                    currentWindow={currentWindow?.default}
                />
            </Paper>
        </>
    );
}