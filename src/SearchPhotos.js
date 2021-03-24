import { useState, useRef, useCallback } from "react";
import useImgSearch from './hooks/useImgSearch';
import useIsSearchUsed from "./hooks/useIsSearchUsed";
import './SearchPhotos.css';


export default function SearchPhotos() {
    const observer = useRef();

    // state
    const [userInput, setUserInput] = useState('');
    const [query, setQuery] = useState('');
    const [pageNumber, setPageNumber] = useState(1);
    const { loading, error, pics, hasMore } = useImgSearch(query, pageNumber);

    const isSearchUsed = useIsSearchUsed(query);

    const loadingMsg = <div className="loader"></div>;
    const noImagesMsg = <div>No images match your search</div>
    const errorMsg = <div>Error loading images</div>;

    const lastPicElementRef = useCallback(node => {
        if (loading) return;
        // disconnect from old last ele, so you can have new last ele
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPageNumber(prevPageNumber => prevPageNumber + 1);
            }
        })
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    function handleInput(e) {
        setUserInput(e.target.value);
    }

    function handleSearch(e) {
        e.preventDefault();
        setQuery(userInput);
        setPageNumber(1);
    }

    return (
        <>
            <h1 className="title">Unsplash Photo Search</h1>
            <form className="form" onSubmit={handleSearch}>
                <input
                    type="text"
                    name="query"
                    className="input"
                    placeholder={`Search for images`}
                    value={userInput}
                    onChange={ handleInput }
                    required
                />
                <button type="submit" className="button">
                    Search
                </button>
            </form>
            <div className="card-list">
                {pics.map((pic, i) => {
                    if (pics.length === i + 1) {
                        return <div className="card"
                                    key={pic.id}
                                    ref={lastPicElementRef}
                                >
                                <img
                                    className="card--image"
                                    alt={pic.alt_description}
                                    src={pic.urls.regular}
                            />
                        </div>
                    } else {
                        return <div className="card" 
                                    key={pic.id} 
                                >
                                <img
                                    className="card--image"
                                    alt={pic.alt_description}
                                    src={pic.urls.regular}
                                />
                            </div>
                    }})
                }
            </div>
            <div className="msg-container">
                { loading && 'Loading...' && loadingMsg }
                {!loading && pics.length === 0 && isSearchUsed && noImagesMsg }
                { error && errorMsg }
            </div>
        </>
    );
}