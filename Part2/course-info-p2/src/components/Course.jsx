const Header = (course) => {
  return (
    <h2>{course.course.name}</h2>
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
    <p><b>Total of {course.course.parts.reduce((acc, curr) =>  acc + curr.exercises, 0)} excercises</b></p>
  )
}

const Course = ({course}) => {
  return (
    <div>
      <Header course={course} />
      <Content course={course}/>
      <Total course={course}/>
    </div>
  )
}

export default Course