
import { ReactNode, createContext } from "react";
import { GraphQLClient } from "graphql-request";

type ProviderProps = {
  element: ReactNode;
};

const client = new GraphQLClient("http://localhost:1337/graphql");
export const GraphQLContext = createContext(client);

export const wrapRootElement = ({ element }: ProviderProps) =>
  <GraphQLContext.Provider value={client}>{ element }</GraphQLContext.Provider>;
