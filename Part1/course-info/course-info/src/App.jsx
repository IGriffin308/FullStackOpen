const Header = (course) => {
  return (
    <h1>{course.course}</h1>
  )
}

const Part = (part) => {
  return (
    <p>{part.part.name} {part.part.exercises}</p>
  )
}

const Content = (parts) => {
  return (
    <div>
      {parts.parts.map(part => <Part key={part.id} part={part} />)}
    </div>
  )
}

const Total = (parts) => {
  return (
    <p>Number of exercises {parts.parts.reduce((acc, curr) =>  acc + curr.exercises, 0)}</p>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const parts = [
    {
      id: 1,
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      id: 2,
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      id: 3,
      name: 'State of a component',
      exercises: 14
    }
  ]
  
  return (
    <div>
      <Header course={course} />
      <Content parts={parts}/>
      <Total parts={parts}/>
    </div>
  )
}

export default App