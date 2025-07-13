import { getAllPokemons } from "./all-pokemons";

export const getPokemonDetails = async (url: string) => {
  const details = await getAllPokemons(url);

  const species = await fetch(details.species.url).then(res => res.json());
  const description = species.flavor_text_entries.find(
    (obj: { language: { name: string } }) =>
      obj.language.name === 'en'
  );

  return {
    name: details.name,
    image: details.sprites.front_default,
    description: description ? description.flavor_text : '',
  }
};