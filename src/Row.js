import React, { useEffect, useState } from 'react';
import axios from './axios';
import './Row.css';
import YouTube from 'react-youtube';
import movieTrailer from 'movie-trailer';

const base_url = "https://image.tmdb.org/t/p/original/";

const Row = ({ title, fetchUrl, isLargeRow }) => {

    const opts = {
        height: '390',
        width: '100%',
        playerVars: {
          // https://developers.google.com/youtube/player_parameters
          autoplay: 1,
        },
      };

    const [movies, setMovies] = useState([]);
    const[trailerUrl, setTrailerUrl] = useState("");

    const handleClick = (movie) =>{
        console.log(movie)
        if(trailerUrl){
            setTrailerUrl('');
        }else{
            movieTrailer(movie?.name || movie?.title || "")
            .then(url => {
                const urlParams = new URLSearchParams(new URL(url).search);
                setTrailerUrl(urlParams.get('v'));
                console.log(trailerUrl, urlParams)
            })
            .catch(error => console.log(error))
        }
    }

    useEffect(() => {

        async function fetchData() {
            const request = await axios.get(fetchUrl);
            setMovies(request.data.results);
            return request;
        }

        fetchData();

    }, [fetchUrl])

    return (
        <div className="row">
            <h2>{title}</h2>
            <div className="row_posters">
                {
                    movies.map(movie => {
                        return <img onClick={() => handleClick(movie)} key={movie.id} className={`row_poster ${isLargeRow && "poster_large"}`} src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`} alt={movie.name}></img>
                    })
                }
            </div>
            { trailerUrl && <YouTube videoId={trailerUrl} opts={opts} /> }
        </div>
    );
};

export default Row;