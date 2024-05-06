import { request } from "graphql-request";
import { GqlHolder } from "../components/models/GqlHolder";
import { GET_HOLDERS } from "./holders.query";
import { Hex } from "viem";

export const fetchHolders = async (address: Hex) => {
  const response = await request<{ dscholders_collection: Array<GqlHolder> }>(
    'https://api.studio.thegraph.com/query/36860/stablecoin-protocol-graph/version/latest',
    GET_HOLDERS
  );

  const filteredHolders = response.dscholders_collection.filter((holder) => {
    return holder.user.toLowerCase() !== address.toLowerCase();
  });
  return filteredHolders;
};