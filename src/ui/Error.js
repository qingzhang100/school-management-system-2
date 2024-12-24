import { useRouteError } from "react-router-dom";

// The Error component handles errors thrown by route loaders, actions, or rendering errors.
// It is not meant for handling 404 (Not Found) cases. Use a wildcard route (path: "*") for that.

function Error() {
  const error = useRouteError();

  console.error("The error:", error);

  return (
    <div>
      <h1>Something Went Wrong</h1>
      {error?.status && <p>Status: {error.status}</p>}
      {error?.statusText && <p>{error.statusText}</p>}
      {error?.message && <p>{error.message}</p>}
    </div>
  );
}

export default Error;
