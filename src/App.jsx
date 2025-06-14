import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import "./App.css";
import { getTrendingMovies, updateSearchCount } from "./appwrite.js";
import MovieCard from "./components/MovieCard.jsx";
import MovieModal from "./components/MovieModal.jsx";
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner_t.jsx";

const API_BASE_URL = "https://api.themoviedb.org/3";
const BEARER_TOKEN = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${BEARER_TOKEN}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [moviesList, setMoviesList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      if (!BEARER_TOKEN) throw new Error("Missing TMDB API token.");

      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) throw new Error("Failed to fetch movies");

      const data = await response.json();
      setMoviesList(data.results || []);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error("Error fetching movies:", error.message);
      setErrorMessage("Failed to fetch movies. Please check your API key and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error("Error fetching trending movies:", error.message);
    }
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
    document.body.style.overflow = "auto";
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1 className="text-4xl font-bold text-white">
            find <span className="text-gradient underline">Movies</span> You'll Enjoy Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2 className=" text-white">Trendings</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img 
                    src={movie.poster_url} 
                    alt={movie.title} 
                    onClick={() => handleMovieClick(movie)}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2 className="text-2xl mt-20 font-semibold text-white mb-4">All Movies</h2>

          {isLoading && (
            <div className="flex justify-center items-center my-4">
              <Spinner />
            </div>
          )}

          {errorMessage && <p className="text-red-500">{errorMessage}</p>}

          <ul className="grid gap-4">
            {moviesList.map((movie) => (
              <li
                key={movie.id}
                onClick={() => handleMovieClick(movie)}
                className="bg-white/10 p-3 rounded-md text-white cursor-pointer hover:bg-white/20 transition"
              >
                <MovieCard movie={movie} />
              </li>
            ))}
          </ul>
        </section>
      </div>

      {isModalOpen && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
    </main>
  );
};


export default App;