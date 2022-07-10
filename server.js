const Hapi = require("@hapi/hapi");
const Graphi = require("graphi");

const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 9000;
const CharacterDb = require("./db.json");

const schema = `
    type Episode {
      id: ID
      name: String
      air_date: String
      episode: String
      characters: [Character]!
      created: String
    }

    type Character {
      id: ID
      name: String
      status: String
      species: String
      type: String
      gender: String
      origin: Location
      location: Location
      image: String
      episode: [Episode]!
      created: String
    }
    
    type Location {
      id: ID
      name: String
      type: String
      dimension: String
      residents: [Character]!
      created: String
    }
    
    input FilterCharacter {
      name: String
      status: String
      species: String
      type: String
      gender: String
    }
    
    type Query {
        characters(filter: FilterCharacter): [Character]
    }
`;

const init = async () => {
    const server = Hapi.server({
        host: HOST,
        port: PORT
    });

    server.route({
        method: "graphql",
        path: "/characters",
        handler: function ({ payload }) {
            if (payload && payload.filter) {
                const { name: nameQuery } = payload.filter;
                const filterMethod = ({ name }) => name.toLowerCase().split(" ").includes(nameQuery.toLowerCase())

                return CharacterDb.characters.filter(filterMethod);
            }

            return CharacterDb.characters;
        }
    });

    await server.register({ plugin: Graphi, options: { schema } });
    await server.start();
    console.log("Server running on %s", server.info.uri);
};

init();