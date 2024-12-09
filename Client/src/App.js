import React, { useEffect, useState } from 'react';
import Axios from "axios";
import MovieCard from './MovieCard';
import SearchIcon from './Search.svg';
import './App.css';

// 75c49904

const API_URL = "https://www.omdbapi.com?apikey=75c49904";

const App = () => {

    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const searchMovies = async(title) => {
        const response = await fetch(`${API_URL}&s=${title}`);
        const data = await response.json();

        setMovies(data.Search);
    };

    useEffect(() => {
        searchMovies('superman');
    }, []);
    //the second attribute [] are the dependencies, which, when changed, the useEffect function will be called.

    const [data,setData] = useState("");

    const getData = async()=>{
        const response = await Axios.get("http://localhost:5000/getData");
        setData(response.data);
    }

    useEffect(()=>{
        getData();
    },[]);

    return(
        <div className='app'>
            <h1>PrimeFlix {data}</h1>

            <div className='search'>
                <input 
                    placeholder='Search for movies' 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown = {(e) => {
                        if(e.key === 'Enter'){
                            searchMovies(searchTerm);
                        }
                    }} 
                />
                <img src={SearchIcon} alt="search" onClick={() => searchMovies(searchTerm)} />
            </div>

            {movies?.length > 0
                ?   (
                    <div className='container'>
                        {movies.map((movie) => (
                            <MovieCard movie={movie} />
                        ))}
                    </div>
                )   :   (
                    <div className='empty'>
                        <h2>No movies found!</h2>
                    </div>
                )
            }
        </div>
    );
}

export default App;