export const getAllPokemons = async (url: string) => {
  return fetch(url).then((res) => res.json());
};
