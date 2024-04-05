import { useEffect, useState } from 'react';
import { Filter, PersonForm, ShowPersons } from './components/Helpers.jsx';
import phonebookService from './Services.jsx';
import { ErrorMessage, SuccessMessage } from './components/errorMessage.jsx';

const App = () => {
  const [persons, setPersons] = useState([]);
  // filteredPersons is a copy of the persons array, used for Dynamic Search Filtering 
  const [filteredPersons, setFilteredPersons] = useState([...persons]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loaded, setLoaded] = useState(false);


  /** READ */
  useEffect(() => {
    // Fetch the initial data from the server
    phonebookService
      .getAll()
      .then(initialNotes => {
        setPersons(initialNotes);
        setFilteredPersons(initialNotes);
      })
      .then(() => {
        setLoaded(true);
      })
      .catch(error => {
        setError('Error fetching data from the server');
        setLoaded(true);
        console.log('Error fetching data', error);
      });
  }, []);


  /** CRUD OPPERATIONS HELPER */
  const submitHelper = (mode, returnedPerson) => {
    let arg;
    let string;
    if (mode === 'update') {
      arg = persons.map(person => person.name === newName ? returnedPerson : person);
      string = `Updated ${returnedPerson.name}`;
    }
    if (mode === 'create') {
      arg = persons.concat(returnedPerson);
      string = `Added ${returnedPerson.name}`;
    }
    if (mode === 'delete') {
      arg = persons.filter(person => person.id !== returnedPerson.id);
      string = `Deleted ${returnedPerson.name}`;
    }
    setFilteredPersons(arg);
    setPersons(arg);
    // Reset the name and number input fields
    setNewName('');
    setNewNumber('');
    console.log(string);
    setSuccess(string);
    setTimeout(() => {
      setSuccess(null);
    }, 5000);
  };


  /** UPDATE AND CREATE */
  const handleSubmit = (event) => {
    event.preventDefault();
    // Create a new person object with the name, number and next id
    const payload = { 
      name: newName, 
      number: newNumber, 
    };
    // Check if the name already exists in the phonebook, prevent adding duplicates
    if (persons.some(person => person.name === newName)) {
      // Confirm the update
      if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
        phonebookService
          .update(persons.find(person => person.name === newName).id, payload)
          .then(returnedPerson => {
            submitHelper('update', returnedPerson);
          })
          .catch(error => {
            setError(error.message);
            setTimeout(() => {
              setError(null);
            }, 5000);
            console.log('Error updating person', error);
          });
      }
    } else {
      // Create a new person object
      phonebookService
        .create(payload)
        .then(returnedPerson => {
          submitHelper('create', returnedPerson);
        })
        .catch(error => {
          setError(error.message);
          setTimeout(() => {
            setError(null);
          }, 5000);
          console.log('Error adding new person', error);
        });
    }
  };


  /** DELETE */
  const deletePerson = (event, id) => {
    event.preventDefault();
    // Find the person object to be deleted
    const person = persons.find(person => person.id === id);
    // Confirm the deletion
    if (window.confirm(`Delete ${person.name} ?`)) {
      // Send the delete request to the server
      phonebookService
        .deletePerson(id)
        .then(() => {
          submitHelper('delete', person);
        })
        .catch(error => {
          submitHelper('delete', person);
          setError('Could not find the person to delete, it may have already been deleted.');
          setTimeout(() => {
            setError(null);
          }, 5000);
          console.log('Error deleting person', error);
        });
    };
  }


  /** SEARCH */
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


  /** EVENT HANDLERS */
  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };


  /** RENDER */
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
        <ErrorMessage message={error} />
      </div>
    );
  };
  return (
    <div>
      <h2>Phonebook</h2>
      <ErrorMessage message={error} />
      <Filter search={search} handleSearch={handleSearch}/>
      <h2>Add a new</h2>
      <SuccessMessage message={success} />
      <PersonForm handleSubmit={handleSubmit} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <ShowPersons filteredPersons={filteredPersons} deletePerson={deletePerson}/>
    </div>
  );
};

export default App
