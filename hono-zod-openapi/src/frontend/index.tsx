import createFetchClient from "openapi-fetch";
import { paths } from "../../__generated";

import createClient from "openapi-react-query";
import { Suspense } from "hono/jsx";

const fetchClient = createFetchClient<paths>({
  baseUrl: "https://myapi.dev/v1/",
});
const $api = createClient(fetchClient);

export default function App() {
  const { data, error } = $api.useSuspenseQuery("get", "/users", {});

return (
  <div>
    <Suspense></Suspense>
  </div>
)
}


<