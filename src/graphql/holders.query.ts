import { gql } from "graphql-request";

export const GET_HOLDERS = gql`
{
  dscholders_collection {
    id,
    user,
    balance
  }
}
`;