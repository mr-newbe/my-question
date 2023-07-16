import { TaskProvider } from "./ContentProv"
import AddTask from "./Adder"
import TaskList from "./ListShow"

export default function TaskForRecoil(){
  return (
    <TaskProvider>
      <h1>Todoist API Controller</h1>
      <AddTask/>
      <TaskList/>
    </TaskProvider>
  )
}