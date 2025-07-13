import { Component } from 'react';
import './App.css';
import { getPokemonDetails } from './api/pokemon-details';
import { getAllPokemons } from './api/all-pokemons';
import type { Pokemon } from './types/pokemon';
import { Loader } from './components/loader/loader';
import { SearchBar } from './components/search-bar/search-bar';
import { PokemonCard } from './components/pokemon-card/pokemon-card';

const pokemonAPI = 'https://pokeapi.co/api/v2/pokemon';

type State = {
  serverUrl: string;
  allPokemons: Pokemon[];
  pokemons: Pokemon[];
  searchTerm: string;
  loading: boolean;
  throwError: boolean;
  error: string | null;
};

export default class App extends Component {
  state: State = {
    serverUrl: `${pokemonAPI}`,
    allPokemons: [],
    pokemons: [],
    searchTerm: localStorage.getItem('searchTerm') || '',
    loading: false,
    throwError: false,
    error: null,
  };

  componentDidMount() {
    this.setupConnection();
  }

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchTerm: e.target.value });
  };

  handleSearchClick = () => {
    localStorage.setItem('searchTerm', this.state.searchTerm);
    this.setupConnection();
  };

  handleThrowError = () => {
    this.setState({ throwError: true });
  };

  setupConnection = async () => {
    this.setState({ loading: true });

    try {
      const { searchTerm } = this.state;

      const limit = searchTerm.trim() ? 1302 : 10;
      const data = await getAllPokemons(`${pokemonAPI}?limit=${limit}`);

      let filteredPokemons = data.results;

      if (searchTerm.trim()) {
        filteredPokemons = data.results.filter((p: { name: string }) =>
          p.name.startsWith(searchTerm.toLowerCase())
        );
      }

      if (filteredPokemons.length === 0) {
        this.setState({ allPokemons: [], pokemons: [] });
        return;
      }

      const allPokemons = await Promise.all(
        filteredPokemons.map((p: { url: string }) => getPokemonDetails(p.url))
      );

      this.setState({
        allPokemons: allPokemons,
        pokemons: allPokemons.slice(0, 10),
      });
    } catch {
      this.setState({ error: 'Something went wrong' });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    if (this.state.throwError) {
      throw new Error('User-triggered error');
    }

    return (
      <div className="app">
        {this.state.loading && <Loader />}

        <SearchBar
          searchTerm={this.state.searchTerm}
          onChange={this.handleInputChange}
          onSearch={this.handleSearchClick}
        />

        <main className="pokemons-list">
          {!this.state.loading &&
            !this.state.error &&
            this.state.allPokemons.length === 0 && (
              <h3 className="no-results-message">
                NO RESULTS <br />
                Please, enter another search
              </h3>
            )}

          {!this.state.loading &&
            this.state.allPokemons.length > 0 &&
            this.state.pokemons.map((pokemon) => (
              <PokemonCard key={pokemon.name} pokemon={pokemon} />
            ))}

          {this.state.error && (
            <h2 className="app-error">
              {this.state.error} <br />
              Please try again later
            </h2>
          )}
        </main>

        <section className="error-btn-block">
          <button onClick={this.handleThrowError}>ERROR BUTTON</button>
        </section>
      </div>
    );
  }
}
