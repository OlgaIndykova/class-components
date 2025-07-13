import type { Pokemon } from '../../types/pokemon';
import './pokemon-card.css';

type Props = {
  pokemon: Pokemon;
};

export function PokemonCard({ pokemon }: Props) {
  return (
    <div className="pokemon-card">
      <img src={pokemon.image} alt={pokemon.name} />
      <div className="pokemon-name">{pokemon.name.toUpperCase()}</div>
      <div className="pokemon-description">
        {pokemon.description.replace('\f', ' ')}
      </div>
    </div>
  );
}
