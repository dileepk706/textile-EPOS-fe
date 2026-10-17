import { IS_DEV } from 'config-global';
import { Button } from 'shared/ui';

type ErrorHandlerProps = {
  error: any;
  resetErrorBoundary: (...args: any[]) => void;
};

export function ErrorHandler(props: ErrorHandlerProps) {
  const { error, resetErrorBoundary } = props;

  // if ((error as any)?.response?.status === 404) {
  //   return <Navigate to="/404" replace />;
  // }

  return (
    <div>
      <h3>Something went wrong.</h3>
      {IS_DEV && (
        <>
          <ul className="error-messages">
            <li key={error.message}>{error.message}</li>
          </ul>
          <pre>{error.stack}</pre>
        </>
      )}
      <Button type="button" onClick={resetErrorBoundary}>
        Try again
      </Button>
    </div>
  );
}
