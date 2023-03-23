import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import MovieCard from "./components/MovieCard";
import YouTube from "react-youtube";

function App() {
  const IMAGE_PATH = "https://image.tmdb.org/t/p/original";
  const API_URL = "https://api.themoviedb.org/3";
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState({});
  const [searchKey, setSearchKey] = useState("");
  const [playTrailer, setPlayerTrailer] = useState(false);

  const fetchMovies = async (searchKey) => {
    const type = searchKey ? "search" : "discover";
    const {
      data: { results },
    } = await axios.get(`${API_URL}/${type}/movie`, {
      params: {
        api_key: process.env.REACT_APP_MOVIE_API_KEY,
        query: searchKey,
      },
    });
    await selectMovie(results[0]);

    setMovies(results);
  };

  const fetchMovie = async (id) => {
    const { data } = await axios.get(`${API_URL}/movie/${id}`, {
      params: {
        api_key: process.env.REACT_APP_MOVIE_API_KEY,
        append_to_response: `videos`,
      },
    });

    return data;
  };

  const selectMovie = async (movie) => {
    const data = await fetchMovie(movie.id);
    console.log(data);
    setSelectedMovie(movie);
  };

  useEffect(() => {
    fetchMovies();
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderMovies = () =>
    movies.map((movie) => (
      <MovieCard key={movie.id} movie={movie} selectMovie={selectMovie} />
    ));

  const searchMovies = (e) => {
    e.preventDefault();
    fetchMovies(searchKey);
  };

  const renderTrailer = () => {
    const trailer = selectedMovie.videos.results.find(
      (vid) => vid.name === "Official Trailer"
    );

    return <YouTube videoId={trailer.key} />;
  };

  return (
    <div className="App">
      <header className={"header"}>
        <div className={"header-content max-center"}>
          <span>This is our TrailerFlix</span>

          <form onSubmit={searchMovies}>
            <input type="text" onChange={(e) => setSearchKey(e.target.value)} />
            <button type={"submit"}>Search!</button>
          </form>
        </div>
      </header>

      <div
        className="poster"
        style={{
          backgroundImage: `url('${IMAGE_PATH}${selectedMovie.backdrop_path}')`,
        }}
      >
        <div className="poster-content max-center">
          {selectedMovie.videos && playTrailer ? renderTrailer() : null}
          <button className={"button"} onClick={() => setPlayerTrailer(true)}>
            Play Trailer
          </button>

          <h1 className={"poster-title"}>{selectedMovie.title}</h1>
          {selectedMovie.overview ? (
            <p className={"poster-overview"}>{selectedMovie.overview}</p>
          ) : null}
        </div>
      </div>

      <div className="container max-center">{renderMovies()}</div>
    </div>
  );
}

export default App;
