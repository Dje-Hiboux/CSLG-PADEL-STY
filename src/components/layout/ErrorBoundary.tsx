import { Component, ReactNode } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-dark-200 flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-6">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-bold text-primary-400">
                Une erreur est survenue
              </h2>
              <p className="text-gray-400">
                {this.state.error?.message || 'Erreur inattendue'}
              </p>
              <Button
                onClick={this.handleRetry}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Réessayer
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}