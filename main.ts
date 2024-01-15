export const get = async (url: string, input: Record<string, string>) => {
  return fetch(`${url}?${new URLSearchParams(input).toString()}`);
};

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "HEAD";

// get a single item or multiple items from Method in order to constrain the method allowed
// for the input

type ConstrainedMethod<T extends Method> = T;

export const mutate = async (
  url: string,
  input: Record<string, string>,
  method: ConstrainedMethod<"POST" | "PUT" | "PATCH">
) => {
  return fetch(url, {
    method: method,
    body: JSON.stringify(input),
  });
};

export const deleteData = async (
  url: string,
  input: Record<string, string>
) => {
  return fetch(url, {
    method: "DELETE",
    body: JSON.stringify(input),
  });
};

type CreateAPIMethod = <TInput extends Record<string, string>, TOutput>(opts: {
  url: string;
  method: Method;
}) => (input: TInput) => Promise<TOutput>;

const CreateAPIMethod: CreateAPIMethod = (opts) => (input) => {
  switch (opts.method) {
    case "GET":
      return get(opts.url, input).then((res) => res.json());
    case "POST":
      return mutate(opts.url, input, "POST").then((res) => res.json);
    case "PUT":
      return mutate(opts.url, input, "PUT").then((res) => res.json());
    case "PATCH":
      return mutate(opts.url, input, "PATCH").then((res) => res.json());
    case "DELETE":
      return deleteData(opts.url, input).then((res) => res.json());
    default:
      throw new Error("Method not allowed");
  }
};

const getBlog = CreateAPIMethod<
  { id: string },
  { post: { id: number; title: string; content: string } }
>({
  method: "GET",
  url: "https://jsonplaceholder.typicode.com/posts",
});
getBlog({ id: "1" });
