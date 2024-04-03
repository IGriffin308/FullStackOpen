const Filter = ({ search, handleSearch }) => {
  return (
    <div>
      filter shown with: <input value={search} onChange={handleSearch}/>
    </div>
  );
};

const PersonForm = ({ handleSubmit, newName, handleNameChange, newNumber, handleNumberChange }) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input value={newName} onChange={handleNameChange}/>
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const ShowPersons = ({ filteredPersons }) => {
  return (
    <div>
      {filteredPersons.map(person => 
        <div key={person.id}>{person.name} {person.number}</div>
      )}
    </div>
  );
};

export { Filter, PersonForm, ShowPersons }