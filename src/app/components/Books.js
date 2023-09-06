// Import necessary Apollo Client utilities and GraphQL tag
import { useQuery, useMutation, gql } from '@apollo/client';

// GraphQL query to fetch all books
const GET_BOOKS = gql`
  query {
    books {
      id
      title
      author
    }
  }
`;

// GraphQL mutation to create a new book
const CREATE_BOOK = gql`
  mutation CreateBook($title: String!, $author: String!) {
    createBook(title: $title, author: $author) {
      id
      title
      author
    }
  }
`;

// GraphQL mutation to update an existing book
const UPDATE_BOOK = gql`
  mutation UpdateBook($id: ID!, $title: String, $author: String) {
    updateBook(id: $id, title: $title, author: $author) {
      id
      title
      author
    }
  }
`;

// GraphQL mutation to delete a book
const DELETE_BOOK = gql`
  mutation DeleteBook($id: ID!) {
    deleteBook(id: $id)
  }
`;

// Books component to manage CRUD operations
const Books = () => {
  // Fetch books using Apollo Client's useQuery hook
  const { loading, error, data } = useQuery(GET_BOOKS);

  // Define mutation hooks for creating, updating, and deleting books
  const [createBook] = useMutation(CREATE_BOOK);
  const [updateBook] = useMutation(UPDATE_BOOK);
  const [deleteBook] = useMutation(DELETE_BOOK);

  // Function to handle creating a new book
  const handleCreateBook = async () => {
    try {
      const { data } = await createBook({ variables: { title: 'New Book', author: 'New Author' } });
      console.log('New book created:', data.createBook);
    } catch (error) {
      console.error('Error creating book:', error);
    }
  };

  // Function to handle updating a book
  const handleUpdateBook = async (id, title, author) => {
    try {
      const { data } = await updateBook({ variables: { id, title, author } });
      console.log('Book updated:', data.updateBook);
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  // Function to handle deleting a book
  const handleDeleteBook = async (id) => {
    try {
      const { data } = await deleteBook({ variables: { id } });
      console.log('Book deleted:', data.deleteBook);
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  // Handle loading and error states
  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error: {error.message}</p>;
  }

  // Render the list of books with buttons for CRUD operations
  return (
    <div>
      <button onClick={handleCreateBook}>Create Book</button>
      <ul>
        {data.books.map((book) => (
          <li key={book.id}>
            {book.title} by {book.author}{' '}
            <button onClick={() => handleUpdateBook(book.id, 'Updated Title', 'Updated Author')}>
              Update
            </button>{' '}
            <button onClick={() => handleDeleteBook(book.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Books;
