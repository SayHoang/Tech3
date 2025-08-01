export const typeDef = `
    type Manufacturer {
        _id: ID!
        name: String!
    }

    input ManufacturerInput {
        name: String!
    }

    enum ManufacturersOrderBy {
        ID_ASC
        ID_DESC
        NAME_ASC
        NAME_DESC
    }

    type ManufacturerConnection {
        nodes: [Manufacturer]
        totalCount: Int
    }

    extend type Query {
        manufacturers(
            first: Int
            offset: Int
            orderBy: [ManufacturersOrderBy!] = ID_ASC
        ): ManufacturerConnection
        manufacturer(_id: ID!): Manufacturer
    }

    extend type Mutation {
        createManufacturer(input: ManufacturerInput!): Manufacturer
        updateManufacturer(_id: ID!, input: ManufacturerInput!): Manufacturer
        deleteManufacturer(_id: ID!): Int
    }
`;

export const resolvers = {
  Query: {
    manufacturers: async (parent, args, context, info) => {
      const { items, totalCount } = await context.db.manufacturers.getAll(args);
      return {
        nodes: items,
        totalCount: totalCount,
      };
    },
    manufacturer: (parent, args, context, info) => {
      return context.db.manufacturers.findById(args._id);
    },
  },
  Mutation: {
    createManufacturer: (parent, args, context, info) => {
      return context.db.manufacturers.create(args.input);
    },
    updateManufacturer: (parent, args, context, info) => {
      return context.db.manufacturers.updateById(args._id, args.input);
    },
    deleteManufacturer: (parent, args, context, info) => {
      return context.db.manufacturers.deleteById(args._id);
    },
  },
};
