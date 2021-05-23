import { useState } from 'react';
import useMount from "./useMount";


export default function useHash(){
    const [hash,setHash] = useState(window.location.hash);

    useMount(() => {
        function onChange(){
            setHash(window.location.hash);
        }
        window.addEventListener('hashchange',onChange);
        return () => {
            window.removeEventListener('hashchange',onChange);
        }
    });

    return hash;
}
