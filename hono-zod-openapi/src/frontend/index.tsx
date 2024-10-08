import createFetchClient from "openapi-fetch";
import { paths } from "../../__generated";

import createClient from "openapi-react-query";

const fetchClient = createFetchClient<paths>({
  baseUrl: "https://myapi.dev/v1/",
});
const $api = createClient(fetchClient);

export default function App() {
  const { data, error, isPending } = $api.useQuery("get", "/users");
  const { mutate } = $api.useMutation("post", "/users");
}
