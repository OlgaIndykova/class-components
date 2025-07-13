import { Component, type ReactNode } from 'react';
import './Error-boundary.css';

type Props = {
  children: ReactNode;
};

type ErrorState = {
  hasError: boolean;
};

export default class ErrorBoundary extends Component<Props, ErrorState> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Caught an error using ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2 className="error-message">
            OOPS! <br /> Looks like the Pokemons ran away
          </h2>
          <button onClick={() => window.location.reload()}>RELOAD PAGE</button>
        </div>
      );
    }

    return this.props.children;
  }
}
