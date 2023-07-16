import {useEffect,useState} from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { Bearer, TaskContent, projID } from './ContentProv';
import axios from 'axios';
import {v4 as uuidv4} from 'uuid';



export default function AddTask(){
  const [inputValue, setInputValue] = useState('');
  const [todoList,setTodoList] = useRecoilState(TaskContent);
  const projectID = useRecoilValue(projID);
  const bearerID = useRecoilValue(Bearer);
  
  //내 기존 totolist와 동기화
  useEffect(() => {
    axios.get(`https://api.todoist.com/rest/v2/tasks?project_id=2315922358`,{
      headers:{
        Authorization:`Bearer 1a5cfa550336f246d80e0b43f8045d003b034002`,
        
      }
    }).then(
      (response)=>{
        console.log("bring data from api");
        
        response.data.map((task)=>{
          console.log(todoList);
          console.log("map 실행");
          setTodoList((prevlist)=>[
            ...prevlist,
            {
              key:task.id,
              id: task.id, //not fixed!!
              content:task.content,
              done:task.is_completed,
            }
          ]);
        })
        console.log(todoList);
        console.log("map 실행 종료");
      }
    )
  }, [])
  
  //todo에 할일을 추가하려 하면
  const addItem = ()=>{
    //요청이 들어갈 자리
    axios.post(`https://api.todoist.com/rest/v2/tasks`,{
      project_id:`${projectID}`,
      content:`${inputValue}`
    },
    {headers: {
      'Content-Type' : 'application/json',
      'Authorization': `Bearer ${bearerID}`,
      'X-Request-Id':uuidv4(),
    }}
    ).then(
      (response)=>{
        idUploader(response.data.id);

      }
    )
     
    //axios 자체가 비동기 처리이다 보니
    //비동기 형식으로 접근해야 한다.

    
    //배열에 객체를 추가한다.
    function idUploader(id){
      setTodoList((prevlist)=>[
        ...prevlist,
        {
          key:id,
          id: id, //not fixed!!
          content:inputValue,
          done:false,
        }
      ]);
    }
    //요청을 하고 받은 id를 넣는다
    
    setInputValue('');
  };

  const valueChange = ({target: {value}})=>{
    setInputValue(value);
  }

  return(
    <>
      <input type="text" value={inputValue} onChange={valueChange}/>
      <button onClick={addItem}>추가</button>
    </>
  )
}

