import { request } from "graphql-request";
import { GqlHolder } from "../components/models/GqlHolder";
import { GET_HOLDERS } from "./holders.query";
import { Hex } from "viem";

export const fetchHolders = async (address: Hex) => {
  const response = await request<{ dscholders_collection: Array<GqlHolder> }>(
    'http://localhost:8000/subgraphs/name/stablecoin-protocol-graph/',
    GET_HOLDERS
  );

  const filteredHolders = response.dscholders_collection.filter((holder) => {
    return holder.user.toLowerCase() !== address.toLowerCase();
  });
  return filteredHolders;
};