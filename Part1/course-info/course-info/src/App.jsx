const Header = (course) => {
  return (
    <h1>{course.course.name}</h1>
  )
}

const Part = (part) => {
  return (
    <p>{part.part.name} {part.part.exercises}</p>
  )
}

const Content = (course) => {
  return (
    <div>
      {course.course.parts.map(part => <Part key={part.id} part={part} />)}
    </div>
  )
}

const Total = (course) => {
  return (
    <p>Number of exercises {course.course.parts.reduce((acc, curr) =>  acc + curr.exercises, 0)}</p>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
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
  }

  return (
    <div>
      <Header course={course} />
      <Content course={course}/>
      <Total course={course}/>
    </div>
  )
}

export default App