import { SplashScreen } from 'shared/ui';
import { AuthContext } from './AuthContext';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function AuthConsumer({ children }: Props) {
  return (
    <AuthContext.Consumer>
      {(auth) => {
        if (auth.loading) {
          return <SplashScreen loadingText="Retrieving your data" />;
        }
        return children;
      }}
    </AuthContext.Consumer>
  );
}
