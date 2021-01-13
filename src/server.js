const {ApolloServer} = require('apollo-server');
const typeDefs= require('./schema/schema');
const resolvers = require('./resolvers/resolver');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const {JWT_SECRET, PORT} = process.env;

const getUser = token => {
    try{
        if(token){
            return jwt.verify(token, JWT_SECRET);
        }
        return null
    }catch(err){
        throw new Error(err.message);
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context:({req})=>{
        const token = req.get('Authorization') || ''
        return {user:getUser(token.replace('Bearer', ''))}
    },
    introspection: true,
    playground:true
});
const port = process.env.PORT || 4000;
server.listen(port).then(({url}) => {
    console.log(`Server is ready at ${url}`)
})