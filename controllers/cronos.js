const { default: axios } = require("axios");
const { connection } = require("../database");

const cryptoApi = async () => {
  try {
    const db = await connection();

    let api;

    let variables = {
      collectionId: "366e1c3857fecce971703df888904e86",
      first: 20,
      after: "WyIxNjc4NjEzMzE4LjY5ODQyIiwiNzA2ODAxODg5Il0=",
    };

    do {
      api = await axios.request({
        method: "POST",
        url: "https://crypto.com/nft-api/graphql",
        headers: {
          accept: "*/*",
          "accept-language": "en",
          "apollographql-client-name": "web",
          "apollographql-client-version": "current",
          b3: "10981124d673154cb6ec04e7583cf136-a7b9ac2f728b3f4b-1",
          "content-type": "application/json",
        },
        data: JSON.stringify({
          query: gqlQuery,
          variables,
        }),
      });

      const ops = api.data.data.public.collection.eventHistory.edges.map(
        (item) => ({
          updateOne: {
            filter: { id: item.node.id },
            update: { $set: { ...item.node } },
            upsert: true,
          },
        })
      );
      await db
        .collection("cronos_third_party_sales")
        .bulkWrite(ops, { ordered: false });
      variables["after"] =
        api.data.data.public.collection.eventHistory.pageInfo.endCursor;
      console.log(
        "🚀 ~ file: cronos_con.js:59 ~ cryptoApi ~ variables['after']:",
        variables["after"]
      );
    } while (variables["after"] != undefined || variables["after"] != null);
  } catch (error) {
    console.log("error.message :>> ", error.message);
  }
};

const gqlQuery = `
query getCollectionEventHistory(
    $collectionId: ID!
    $first: Int
    $after: String
    $naturesIn: [String!]
  ) {
    public {
      collection(id: $collectionId) {
        id
        eventHistory(first: $first, after: $after, naturesIn: $naturesIn) {
          edges {
            node {
              id
              asset {
                id
                copies
                name
                cover {
                  url
                }
                kind
                copiesInCirculation
                isExternalNft
              }
              edition {
                index
              }
              user {
                id
                uuid
                username
                displayName
              }
              toUser {
                id
                uuid
                username
                displayName
              }
              listing {
                externalUser {
                  address
                  username
                  avatar {
                    url
                  }
                }
                currency
                salePriceDecimalUSD
              }
              nature
              mode
              amountDecimal
              createdAt
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
  }
`;

module.exports = {
  cryptoApi,
};

cryptoApi();
