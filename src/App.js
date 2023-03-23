import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import MovieCard from "./components/MovieCard";
import YouTube from "react-youtube";
import logo from "./trailerlogo.png";

function App() {
  const IMAGE_PATH = "https://image.tmdb.org/t/p/original/";
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

  useEffect(() => {
    fetchMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    setPlayerTrailer(false);
    const data = await fetchMovie(movie.id);
    setSelectedMovie(data);
    handleClickScroll();
  };

  const searchMovies = (e) => {
    e.preventDefault();
    fetchMovies(searchKey);
  };

  const handleClickScroll = () => {
    const element = document.getElementById("top-of-page");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const renderTrailer = () => {
    const trailer = selectedMovie?.videos?.results?.find((vid) => vid?.name === "Official Trailer");
    const trailerKey = trailer ? trailer.key : selectedMovie?.videos?.results[1].key;

    return (
      <YouTube
        videoId={trailerKey}
        containerClassName={"youtube-container"}
        opts={{
          width: "100%",
          height: "500px",
          playerVars: { autoplay: 1, controls: 0 },
        }}
      />
    );
  };

  return (
    <div className="App">
      <header className={"header"} id={"top-of-page"}>
        <div className={"header-content max-center"}>
          <img src={logo} alt="logo" />

          <form onSubmit={searchMovies}>
            <input type="text" onChange={(e) => setSearchKey(e.target.value)} />
            <button type={"submit"}>Search!</button>
          </form>
        </div>
      </header>

      {selectedMovie && (
        <div
          className="poster"
          style={{
            backgroundImage: `url('${IMAGE_PATH}${selectedMovie.backdrop_path}')`,
          }}
        >
          <div className="poster-content max-center">
            <h1 className={"poster-title"}>{selectedMovie.title}</h1>
            {selectedMovie.overview ? <p className={"poster-overview"}>{selectedMovie.overview}</p> : null}
            {selectedMovie.videos && playTrailer ? renderTrailer() : null}
            {playTrailer ? (
              <button className={"button"} onClick={() => setPlayerTrailer(false)}>
                Close
              </button>
            ) : (
              <button className={"button"} onClick={() => setPlayerTrailer(true)}>
                Play Trailer
              </button>
            )}
          </div>
        </div>
      )}

      <div className="container max-center">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} selectMovie={selectMovie} />
        ))}
      </div>
    </div>
  );
}

export default App;
