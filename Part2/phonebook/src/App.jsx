import { useState } from 'react';
import { Filter, PersonForm, ShowPersons } from './components/Helpers.jsx';


const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [search, setSearch] = useState('');
  const [filteredPersons, setFilteredPersons] = useState([...persons]);

  // Find the maximum id in the persons array
  let maxId = persons.length > 0 ? Math.max(...persons.map(person => person.id)) : 0;

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
    maxId += 1;
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
