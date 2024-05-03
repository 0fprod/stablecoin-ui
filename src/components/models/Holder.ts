import { GqlHolder } from "./GqlHolder";

export interface DomainHolder {
  walletAddress: string;
  healthFactor: number;
}

export function mapFromGqlHolderToDomainHolder(gqlHolder: GqlHolder): DomainHolder {
  return {
    walletAddress: gqlHolder.user.toLowerCase(),
    healthFactor: 0,
  };
}
