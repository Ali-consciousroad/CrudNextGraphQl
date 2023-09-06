// Required libraries and modules
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true });

// Setup the connection instance and error handling for MongoDB
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
    console.log("Successfully connected to MongoDB!");
});

// Initialize Express app
const app = express();

// GraphQL schema definitions
const typeDefs = gql`
  type Book {
    id: ID!
    title: String!
    author: String!
  }

  type Query {
    books: [Book]
    book(id: ID!): Book
  }

  type Mutation {
    createBook(title: String!, author: String!): Book
    updateBook(id: ID!, title: String, author: String): Book
    deleteBook(id: ID!): Boolean
  }
`;

// Sample data
const books = [
  { id: '1', title: 'Book 1', author: 'Author 1' },
  { id: '2', title: 'Book 2', author: 'Author 2' },
];

// Resolvers for executing our GraphQL queries and mutations
const resolvers = {
  Query: {
    // Return all books
    books: () => books,
    // Find and return a book by its ID
    book: (parent, { id }) => books.find((book) => book.id === id),
  },
  Mutation: {
    // Create a new book
    createBook: (parent, { title, author }) => {
      const newBook = { id: String(books.length + 1), title, author };
      books.push(newBook);
      return newBook;
    },
    // Update an existing book
    updateBook: (parent, { id, title, author }) => {
      const book = books.find((book) => book.id === id);
      if (!book) {
        throw new Error('Book not found');
      }
      book.title = title || book.title;
      book.author = author || book.author;
      return book;
    },
    // Delete a book by its ID
    deleteBook: (parent, { id }) => {
      const bookIndex = books.findIndex((book) => book.id === id);
      if (bookIndex === -1) {
        throw new Error('Book not found');
      }
      books.splice(bookIndex, 1);
      return true;
    },
  },
};

// Asynchronous function to start Apollo server and Express app
const startServer = async () => {
    const server = new ApolloServer({ typeDefs, resolvers });
  
    // Start the Apollo Server
    await server.start();
  
    // Middleware for ApolloServer with Express
    server.applyMiddleware({ app });
  
    // Start the Express server
    app.listen({ port: 4000 }, () =>
      console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
    );
}
  
// Kick off the server initialization
startServer();
