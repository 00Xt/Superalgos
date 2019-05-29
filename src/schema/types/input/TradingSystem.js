import {
  GraphQLInputObjectType,
} from 'graphql';
import GraphQLJSON from 'graphql-type-json';

const Type = new GraphQLInputObjectType({
  name: 'TradingSystemInput',
  description: 'Payload for trading system  input',
  fields: () => ({
    data: { type: GraphQLJSON },
  }),
});

export default Type;
