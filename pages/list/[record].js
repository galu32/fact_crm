import React from 'react';
import {makeStyles} from '@material-ui/core/styles';

import { useRouter } from 'next/dist/client/router';

import { Edit, PlusOne } from '@material-ui/icons';

import { Paper, Tooltip } from '@material-ui/core';

import TableComponent from '../../components/Table';
import ColumnEditorModal from '../../components/ColumnEditorModal';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
        overflow: 'hidden'
    },
    modal: {
        backgroundColor: 'lightgrey',
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(5),
        justifyContent: 'center',
        alignItems: 'center',
        height: '50%',
        width: '50%'
    }
}));

// eslint-disable-next-line react/prop-types
export default function List({setToolbarTitle, setToolbarActions, setLoading}) {
    const styles = useStyles();
    const router = useRouter();

    const [openEditModal, setOpenEditModal] = React.useState(false);

    const [allHeads, setAllHeads] = React.useState([]);
    const [headers, setHeaders] = React.useState([]);
    const [rows, setRows] = React.useState([]);

    React.useEffect(() => {
        const {record} = router.query;
        if (!record) return;
        setLoading(true);
        import('../../src/window/' + record + 'Window.js')
            .then((w) => {
                if (!w) {
                    throw new Error('Incorrect path name');
                }
                w.default.getListWindowRows().then(rows => {
                    if (rows.length) {
                        setToolbarTitle(`Listado de ${w.default.getDescription().pluralTitle}`);
                        const h = w.default.getListWindowHeaders();
                        const allH = Object.keys(rows[0]);
                        setHeaders(h.length ? h : allH);
                        setAllHeads(allH);
                        setRows([...rows]);
                    }
                    setLoading(false);
                }).catch(console.log);

            });
    }, [router.query.record, router.query.internalId]);

    React.useEffect(() => {
        const toolt = (t, c) => <Tooltip title={t}>{c}</Tooltip>;
        setToolbarActions([
            toolt('Editar',<Edit key="print" onClick={() => setOpenEditModal(true)} />),
            toolt('Editar',<PlusOne key="plus" onClick={() => router.push(`/window/${router.query.record}/0`)} />),
        ]);
    }, [router.query.record]);

    return (
        <>
            <ColumnEditorModal 
                headers={headers}
                unusedHeaders={allHeads.filter(head => !headers.includes(head))}
                onClose={(newHeaders) => !setOpenEditModal(false) && newHeaders && setHeaders(newHeaders)}
                open={openEditModal}/>
            <Paper className={styles.root}
                elevation={6} square >
                <TableComponent 
                    headers={headers}
                    rows={rows}
                    onRowClick={(row) => {
                        router.push(`/window/${router.query.record}/${row.internalId}`);
                    }} />
            </Paper>
        </>
    );
}