import React, { useEffect, useState } from 'react';
import Axios from "axios";
import MovieCard from './MovieCard';
import SearchIcon from './Search.svg';
import './App.css';

const API_URL = "https://www.omdbapi.com?apikey=75c49904";

const App = () => {
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [token, setToken] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [watchlist, setWatchlist] = useState([]);

    const searchMovies = async (title) => {
        const response = await fetch(`${API_URL}&s=${title}`);
        const data = await response.json();
        setMovies(data.Search);
    };

    const login = async () => {
        try {
            const response = await Axios.post("http://localhost:5000/login", { username, password });
            setToken(response.data.token);
        } catch (error) {
            console.error("Login failed:", error.response.data.message);
        }
    };

    const register = async () => {
        try {
            await Axios.post("http://localhost:5000/register", { username, password });
            alert("Registration successful. Please log in.");
        } catch (error) {
            console.error("Registration failed:", error.response.data.message);
        }
    };

    const addToWatchlist = async (movie) => {
        try {
            const response = await Axios.post("http://localhost:5000/addToWatchlist", { token, movie });
            setWatchlist(response.data.watchlist);
        } catch (error) {
            console.error("Failed to add to watchlist:", error.response.data.message);
        }
    };

    const fetchWatchlist = async () => {
        try {
            const response = await Axios.get("http://localhost:5000/watchlist", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setWatchlist(response.data.watchlist);
        } catch (error) {
            console.error("Failed to fetch watchlist:", error.response.data.message);
        }
    };

    useEffect(() => {
        if (token) fetchWatchlist();
    }, [token]);

    useEffect(() => {
        searchMovies('superman');
    }, []);

    return (
        <div className='app'>
            <div>
                <h2>User Login</h2>
                <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button onClick={login}>Login</button>
                <button onClick={register}>Register</button>
            </div>
            <h1>PrimeFlix</h1>

            <div className='search'>
                <input
                    placeholder='Search for movies'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            searchMovies(searchTerm);
                        }
                    }}
                />
                <img src={SearchIcon} alt="search" onClick={() => searchMovies(searchTerm)} />
            </div>

            {movies?.length > 0 ? (
                <div className='container'>
                    {movies.map((movie) => (
                        <MovieCard
                            key={movie.imdbID}
                            movie={movie}
                            addToWatchlist={addToWatchlist}
                        />
                    ))}
                </div>
            ) : (
                <div className='empty'>
                    <h2>No movies found!</h2>
                </div>
            )}

            <h2>Your Watchlist</h2>
            {watchlist.length > 0 ? (
                <div className='container'>
                    {watchlist.map((movie, index) => (
                        <div key={index} className="movie">
                            <h3>{movie}</h3>
                        </div>
                    ))}
                </div>
            ) : (
                <div className='empty'>
                    <h3>Your watchlist is empty!</h3>
                </div>
            )}
        </div>
    );
};

export default App;
