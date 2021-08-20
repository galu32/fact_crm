export default function onMobileOnDsk (mobile, dsk, theme) {
    const {xs, sm} = mobile;
    const {md} = dsk;
    return {
        [theme.breakpoints.down('xs')]: xs || mobile,
        [theme.breakpoints.down('sm')]: sm || mobile,
        [theme.breakpoints.up('md')]: md || dsk,
        [theme.breakpoints.up('lg')]: dsk,
        [theme.breakpoints.up('xl')]: dsk,
    };
}