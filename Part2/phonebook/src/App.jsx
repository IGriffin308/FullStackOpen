import { useEffect, useState } from 'react';
import { Filter, PersonForm, ShowPersons } from './components/Helpers.jsx';
import axios from 'axios';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [search, setSearch] = useState('');
  const [filteredPersons, setFilteredPersons] = useState([...persons]);
  const [maxId, setMaxId] = useState(0);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Fetch the initial data from the server
    axios.get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data);
        setFilteredPersons(response.data);
        // Find the maximum id in the persons array
        let newId = response.data.length > 0 ? Math.max(...response.data.map(person => person.id)) : 0;
        setMaxId(newId);
      })
      .then(() => {
        setLoaded(true);
      })
      .catch(error => {
        setError(error);
        console.log('Error fetching data', error);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Check if the name already exists in the phonebook, prevent adding duplicates
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    };
    // Create a new person object with the name, number and next id
    let payload = { name: newName, number: newNumber, id: maxId + 1};
    // Increment the maxId for the next person
    setMaxId(maxId + 1);
    // Add the new person to the persons array and update the filteredPersons array
    setFilteredPersons(persons.concat(payload));
    setPersons(persons.concat(payload));
    // Reset the name and number input fields
    setNewName('');
    setNewNumber('');
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  // Filter the persons array based on the search input, update the displayed data in real time.
  const handleSearch = (event) => {
    event.preventDefault();
    setSearch(event.target.value);
    // If the search input is empty, display all persons.
    if (event.target.value === '') {
      setFilteredPersons([...persons]);
      return;
    };
    // Filter the persons array based on the search input, in real time.
    setFilteredPersons(persons.filter(person => person.name.toLowerCase().includes(event.target.value.toLowerCase())));
  };

  if (!loaded) {
    return (
      <div>
        <h2>Phonebook</h2>
        <p>Loading data from the server...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div>
        <h2>Phonebook</h2>
        <p>Error fetching data from the server</p>
      </div>
    );
  };
  return (
    <div>
      <h2>Phonebook</h2>
      <Filter search={search} handleSearch={handleSearch}/>
      <h2>Add a new</h2>
      <PersonForm handleSubmit={handleSubmit} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <ShowPersons filteredPersons={filteredPersons}/>
    </div>
  );
};

export default App
