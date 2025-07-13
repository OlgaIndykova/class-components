import { Component } from 'react';
import './App.css';
import { getPokemonDetails } from './api/pokemon-details';
import { getAllPokemons } from './api/all-pokemons';

const pokemonAPI = 'https://pokeapi.co/api/v2/pokemon';

type Pokemon = {
  name: string;
  image: string;
  description: string;
};

type State = {
  serverUrl: string;
  allPokemons: Pokemon[];
  pokemons: Pokemon[];
  searchTerm: string;
  loading: boolean;
  throwError: boolean;

};

export default class App extends Component {
  state: State = {
    serverUrl: `${pokemonAPI}`,
    allPokemons: [],
    pokemons: [],
    searchTerm: localStorage.getItem('searchTerm') || '',
    loading: false,
    throwError: false,
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
      }

      const allPokemons = await Promise.all(
        filteredPokemons.map((p: { url: string }) => getPokemonDetails(p.url))
      );

      this.setState({
        allPokemons: allPokemons,
        pokemons: allPokemons.slice(0, 10)
      });
    } catch (error) {
      console.error(error);
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    if (this.state.throwError) {
      throw new Error('User-triggered error');
    }

    return (
      <div className='app'>
        {this.state.loading &&
          <div className='loader-wrapper'>
            <img className='loader-body' src="/pokeball-pokemon.svg" alt="pokeball" />
          </div>
        }

        <section className="search-section">
          <input value={this.state.searchTerm} onChange={this.handleInputChange} />
          <button onClick={this.handleSearchClick}>SEARCH POKEMON</button>
        </section>

        <main className="pokemons-list">
          {!this.state.loading && this.state.allPokemons.length === 0 &&
            <h3 className='no-results-message'>
              NO RESULTS <br />
              Please, enter another search
            </h3>
          }

          {!this.state.loading && this.state.allPokemons.length > 0 && this.state.pokemons.map((pokemon) => (
            <div key={pokemon.name} className="pokemon-card">
              <img src={pokemon.image} alt={pokemon.name} />
              <div className="pokemon-name">{pokemon.name.toUpperCase()}</div>
              <div className="pokemon-description">
                {pokemon.description.replace('\f', ' ')}
              </div>
            </div>
          ))}
        </main>

        <section className="error-btn-block">
          <button onClick={this.handleThrowError}>ERROR BUTTON</button>
        </section>
      </div>
    );
  }
}