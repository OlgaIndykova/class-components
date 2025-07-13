import { Component } from "react";
import { getPokemonDetails } from "./api/pokemon-details";

const pokemonAPI = 'https://pokeapi.co/api/v2/pokemon?limit=10';

type Pokemon = {
  name: string;
  image: string;
  description: string;
};

type State = {
  serverUrl: string;
  pokemons: Pokemon[];
};

export class App extends Component {
  state: State = {
    serverUrl: pokemonAPI,
    pokemons: [],
  };

  componentDidMount() {
    this.setupConnection();
  }

  setupConnection = async () => {
    try {
      const data = await fetch(this.state.serverUrl).then(res => res.json());

      const pokemons = await Promise.all(
        data.results.map((p: { url: string }) => getPokemonDetails(p.url))
      );

      this.setState({ pokemons });
    } catch {
      this.setState({ error: 'Something went wrong' });
    }
  };

  render() {
    return (
      <div>
        <section className="search-section">
          <input/>
          <button>SEARCH POKEMON</button>
        </section>

        <main className="pokemons-list">
          {this.state.pokemons.map((pokemon) => (
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
          <button>ERROR BUTTON</button>
        </section>
      </div>
    );
  }
}

export default App;