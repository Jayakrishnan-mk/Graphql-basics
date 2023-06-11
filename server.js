const express = require('express');
const { buildSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');
const axios = require('axios');

const app = express();

const schema = buildSchema(`

    type Post {
        userId: Int
        id: Int
        title: String
        body: String
    }


    type User {
        name: String
        age: Int
        college: String
    }


    type Query {
        hello: String!
        welcomeMessge(name: String, dayOfWeek: String!): String
        getUser: User
        getUsers: [User]
        getPostFromExternalApi: [Post]
        message: String
    }

    input UserInput {
        name: String!
        age: Int!
        college: String!
    }

    type Mutation {
        setMessage(newMessage: String): String
        createUser(user: UserInput): User
    }
`)


let message = "This is my message."

const root = {
    hello: () => {
        return "Hello world...";
    },
    welcomeMessge: (args) => {
        console.log(args);
        return `Hey ${args.name} josh is here.., Today is ${args.dayOfWeek}😄😄`
    },
    getUser: () => {
        const user = {
            name: "JK",
            age: 23,
            college: "IIM Ahmedabad",
        };
        return user;
    },
    getUsers: () => {
        const users = [
            {
                name: "JK",
                age: 23,
                college: "IIM Ahmedabad",
            },
            {
                name: "Prakash",
                age: 25,
                college: "IIM Bangalore",
            }
        ];
        return users;
    },
    getPostFromExternalApi: async () => {
        const result = await axios.get('https://jsonplaceholder.typicode.com/posts');
        return result.data;
    },
    setMessage: ({newMessage}) => {
        message = newMessage;
        return message;
    },
    message: () => message,
    createUser: ( args ) => {
        return args.user
    } 
    
}

app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema: schema,
    rootValue: root,
}))

app.listen(3333, () => {
    console.log('Server started on port 3333.');
});