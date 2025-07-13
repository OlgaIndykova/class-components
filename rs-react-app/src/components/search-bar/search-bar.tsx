import './search-bar.css';

type Props = {
  searchTerm: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
};

export function SearchBar({ searchTerm, onChange, onSearch }: Props) {
  return (
    <section className="search-section">
      <input value={searchTerm} onChange={onChange} />
      <button onClick={onSearch}>SEARCH POKEMON</button>
    </section>
  );
}