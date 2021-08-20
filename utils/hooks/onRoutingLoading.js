import React from 'react';

import { useRouter } from 'next/dist/client/router';

export default function onRoutingLoading(setLoadingHandler) {
    const router = useRouter();

    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        const handleStart = (url) => (url !== router.asPath) && (setLoadingHandler && setLoadingHandler(true)) || setLoading(true);
        const handleComplete = (url) => (url === router.asPath) && (setLoadingHandler && setLoadingHandler(false)) || setLoading(false);

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);

        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleComplete);
        };
    });
    
    return loading;
}