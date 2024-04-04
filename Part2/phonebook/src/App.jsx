import { useEffect, useState } from 'react';
import { Filter, PersonForm, ShowPersons } from './components/Helpers.jsx';
import noteService from './Services.jsx';

const App = () => {
  const [persons, setPersons] = useState([]);
  // filteredPersons is a copy of the persons array, used for Dynamic Search Filtering 
  const [filteredPersons, setFilteredPersons] = useState([...persons]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [search, setSearch] = useState('');
  /** // references to the maximum id in the persons array are no longer needed in this version
  const [maxId, setMaxId] = useState(0); */
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Fetch the initial data from the server
    noteService
      .getAll()
      .then(initialNotes => {
        setPersons(initialNotes);
        setFilteredPersons(initialNotes);
        /** // references to the maximum id in the persons array are no longer needed in this version
        // Find the maximum id in the persons array
        let newId = initialNotes.length > 0 ? Math.max(...initialNotes.map(person => person.id)) : 0;
        setMaxId(newId); */
      })
      .then(() => {
        setLoaded(true);
      })
      .catch(error => {
        setError(error);
        setLoaded(true);
        console.log('Error fetching data', error);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Create a new person object with the name, number and next id
    const payload = { 
      name: newName, 
      number: newNumber, 
      /** // references to the maximum id in the persons array are no longer needed in this version
      id: maxId + 1 */
    };
    /** // references to the maximum id in the persons array are no longer needed in this version
    // Increment the maxId for the next person
    setMaxId(maxId + 1); */
    // Check if the name already exists in the phonebook, prevent adding duplicates
    if (persons.some(person => person.name === newName)) {
      // Confirm the update
      if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
        noteService
          .update(persons.find(person => person.name === newName).id, payload)
          .then(returnedPerson => {
            console.log('Person updated:', returnedPerson);
            // Update the person in the persons array and update the filteredPersons array
            setFilteredPersons(persons.map(person => person.name === newName ? returnedPerson : person));
            setPersons(persons.map(person => person.name === newName ? returnedPerson : person));
            // Reset the name and number input fields
            setNewName('');
            setNewNumber('');
          })
          .catch(error => {
            setError(error);
            console.log('Error updating person', error);
          });
      }
    } else {
      // Send the new person object to the server
      noteService
        .create(payload)
        .then(returnedPerson => {
          console.log('New person added:', returnedPerson);
          // Add the new person to the persons array and update the filteredPersons array
          setFilteredPersons(persons.concat(returnedPerson));
          setPersons(persons.concat(returnedPerson));
          // Reset the name and number input fields
          setNewName('');
          setNewNumber('');
        })
        .catch(error => {
          setError(error);
          console.log('Error adding new person', error);
        });
    }
  };

  const deletePerson = (event, id) => {
    event.preventDefault();
    // Find the person object to be deleted
    const person = persons.find(person => person.id === id);
    // Confirm the deletion
    if (window.confirm(`Delete ${person.name} ?`)) {
      // Send the delete request to the server
      noteService
        .deletePerson(id)
        .then(() => {
          console.log('Person deleted:', person);
          // Remove the person from the persons array and update the filteredPersons array
          setFilteredPersons(persons.filter(person => person.id !== id));
          setPersons(persons.filter(person => person.id !== id));
        })
        .catch(error => {
          setError(error);
          console.log('Error deleting person', error);
        });
    };
  }

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
        <p>{error.message}</p>
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
      <ShowPersons filteredPersons={filteredPersons} deletePerson={deletePerson}/>
    </div>
  );
};

export default App
