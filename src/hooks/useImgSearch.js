import { useState, useEffect } from "react";
import useFirstRun from "./useFirstRun";
import { createApi } from 'unsplash-js';

const unsplash = createApi({
    accessKey: 'Your-unsplash-API-key',    
});

export default function SearchPhotos(query, pageNumber) {
    const isFirstRun = useFirstRun();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [pics, setPics] = useState([]);
    const [hasMore, setHasMore] = useState(false);

    // reset pics after each query
    useEffect(() => {
        if (isFirstRun) return;
        setPics([]);
    }, [query, isFirstRun])

    useEffect(() => {
        if (isFirstRun) return;
        if (query.length !== 0) {
            setError(false);
            setLoading(true);
            async function fetchAPI() {
                unsplash.search.getPhotos({
                    query,
                    page: pageNumber,
                    perPage: 10,
                }).then(res => {
                    if (res.errors) {
                        setError(true);
                    } else {
                        setPics(prevPics => {
                            // spreading into array creates a wrapper array -> response is already an array
                            return [...prevPics, ...res.response.results];
                        });
                        setHasMore(res.response.results.length < res.response.total);
                        setLoading(false);
                    }
                });
            }
            fetchAPI();
        }
    }, [query, pageNumber, isFirstRun]);

    return { loading, error, pics, hasMore };
}
