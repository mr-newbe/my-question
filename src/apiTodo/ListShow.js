import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { Bearer, TaskContent, projID } from "./ContentProv"
import {useState,useEffect} from 'react';
import axios from 'axios';


//task의 변경과 삭제가 이루어져야 하는 곳이다.
export default function TaskList(){
  const [contentArray,setContentArray] = useRecoilState(TaskContent);
  console.log(contentArray);
  console.log("tasklist open");
  return(
    <>
      {contentArray.length!==0 ? 
        contentArray.map(data=>(
          <div>
            <TaskItem item={data}/>
          </div>
        )) :
        <div>
          <br/>
          <br/>
          <div>할일을 추가하세요! 아직 시간은 많습니다!</div>
        </div>  
      }
      
    </>
  )
}




function TaskItem({item}){
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [taskItem,editTaskItem] = useRecoilState(TaskContent);

  const bearerID = useRecoilValue(Bearer);
  const projectID = useRecoilValue(projID);
  const index = taskItem.findIndex((listItem) => listItem===item);

  
  //할일끝냈는지 변경
  const toggleEdit = ()=>{
    const newList = replaceItemAtIndex(taskItem, index, {
      ...item,
      done: !item.done,
    });

    editTaskItem(newList);
  }

  const deleteItem = ()=>{
    const dell = taskItem[index].id;
    console.log(dell.id);

    
    axios.delete(`https://api.todoist.com/rest/v2/tasks/${dell}`,{
      headers:{
        Authorization:`Bearer ${bearerID}`
      }
      
    })
    

    const newList = removeItemAtIndex(taskItem,index);
    editTaskItem(newList);
  };



  const changingInput = ({target: {value}})=>{
    setEditValue(value);
  };


//구현해야 하는 기능 : 
//editValue를 가져와서 바꾸려는 인덱스의 content 값을 바꾼다. 
//여기서 done의 값도 false로 바꿔줘야 한다.

  //수정하는 코드
  const applyEdit = ()=>{
    const newList = replaceItemAtIndex(taskItem,index,{
      ...item,
      content : editValue
    });

    editTaskItem(newList);
    setIsEditing(false);

    console.log(newList);
    //미래에 통신기능을 넣도록 하겠습니다.
    
  };
  
  
  let taskContent;
  if(isEditing===true){
    taskContent = (
      <>
        <input 
          id = {item.id}
          type="text" 
          placeholder={item.content} 
          onChange={changingInput}
        />
        <button id={item.id} onClick={()=>applyEdit()}>
          Save
        </button>
      </>
    ); 
  } else {
    taskContent = (
      <>
        {item.content}
        <button onClick={()=>setIsEditing(true)}>
          Edit
        </button>
      </>
    )
    
  }

  return(
    <label>
      <input
        type="checkbox"
        checked = {item.done}
        onChange = {toggleEdit}
      />
      {taskContent}
      <button onClick={deleteItem}>delete</button>
    </label>

  )
}


function replaceItemAtIndex(arr, index, newValue){
  return [...arr.slice(0,index), newValue, ...arr.slice(index+1)];
}
//파라미터로 온 인덱스 뒤로 잘라버린다.
function removeItemAtIndex(arr, index){
  return [...arr.slice(0,index), ...arr.slice(index+1)];
}