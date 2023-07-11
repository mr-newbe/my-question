import { 
  RecoilRoot,
  atom, 
  selector, 
  useRecoilState, 
  useRecoilValue, 
  useSetRecoilState 
} from "recoil";
import {useState} from 'react';


export function Todo_show(){
  return (
    <RecoilRoot>
      <TodoList/>
    </RecoilRoot>
  )
}

//정의할 원소는 todoListState, 값은 배열
const todoListState = atom({
  key:'todoListState',
  default: [],
});

//여기서 useRecoilValue로 값만을 가져온다
function TodoList(){
  //changed from todoListState to filteredTodoListState
  //기존에 모든 배열을 반환하던 것에서 필터링된 것만을
  //반환하는 것으로 변경되었다....
  const todoList = useRecoilValue(filteredTodoListState);

  return (
    <>
      <TodoListStatistic />
      <TodoListFilters />
      <TodoItemCreator />

      {todoList.map((todoItem) => (
        <TodoItem key={todoItem.id} item={todoItem} />
      ))}
    </>
  );
}
//todoitem 하나당 컴포넌트가 추가된다
//map으로 이뤄낸 결과이다.

function TodoItemCreator() {
  const [inputValue, setInputValue] = useState('');
  const setTodoList = useSetRecoilState(todoListState);

  const addItem = () => {
    setTodoList((oldTodoList) => [
      ...oldTodoList,
      {
        id: getId(),
        text: inputValue,
        isComplete: false,
      },
    ]);
    setInputValue('');
  };

  const onChange = ({target: {value}}) => {
    setInputValue(value);
  };

  return (
    <div>
      <input type="text" value={inputValue} onChange={onChange} />
      <button onClick={addItem}>Add</button>
    </div>
  );
}

//고유 id 생성을 위한 유틸
let id = 0;
function getId(){
  return id++;
}


function TodoItem({item}){
  //TodoItem으로 입력된 item과 같은 값을 가진 것을 index로 
  //받아오도록 한다.
  const [todoList, setTodoList] = useRecoilState(todoListState);
  const index = todoList.findIndex((listItem) => listItem === item)

  //새로운 객체를 만들어서 상태에 추가한다.
  const editItemText = ({target:{value}}) => {
    const newList = replaceItemAtIndex(todoList, index,{
      ...item,
      text : value,
    });

    setTodoList(newList);
  };
  
  const toggleItemCompletion = ()=>{
    const newList = replaceItemAtIndex(todoList, index, {
      ...item,
      isComplete: !item.isComplete,
    });

    setTodoList(newList);
  }

  const deleteItem = () => {
    const newList = removeItemAtIndex(todoList, index);

    setTodoList(newList);
  };

  return (
    <div>
      <input type="text" value={item.text} onChange={editItemText}/>
      <input
        type="checkbox"
        checked={item.isComplete}
        onChange={toggleItemCompletion}
      />
      <button onClick={deleteItem}>X</button>
    </div>
  );
}

//반환하는 값은 새로운 배열이다.
//기존의 배열을 대체하는 배열(ecit 기능)
function replaceItemAtIndex(arr, index, newValue){
  return [...arr.slice(0,index), newValue, ...arr.slice(index+1)];
}
//파라미터로 온 인덱스 뒤로 잘라버린다.
function removeItemAtIndex(arr, index){
  return [...arr.slice(0,index), ...arr.slice(index+1)];
}



//Selector
//Seloctor는 파상된, 상태의 일부를 나타낸다.
//다른 데이터에 의존하는 동적인 데이터를 만들 수 있다.

//이 개념으로 만들 것은 다음과 같다.
//1.필터링된 todo 리스트 (필터링 기준은 show all, show completed, show uncompleted)
//2.todo 리스트 통계


//이곳에는 필터링 조건이 들어갈 것이다(변경될 것이다)
const todoListFilterState = atom({
  key: 'todoListFilterState',
  default : 'Show All',
});

//todoListFilterState와 todoListState를 활용해
//필터링된 리스트를 파생하는 filteredTodoListState selector를 
//구성했습니다.
const filteredTodoListState = selector({
  key:'filterdTodoListState',
  get: ({get})=>{
    const filter = get(todoListFilterState);
    const list = get(todoListState);
    //selector에서 파생한 filteredTodoListState가 변화함에 따라
    //리턴하는 값이 달라진다.
    switch (filter){
      case 'Show Completed':
        return list.filter((item)=>item.isComplete);
      case 'Show Uncompleted':
        return list.filter((item) => !item.isComplete);
      default:
        return list;
    }
  },
});
//filteredTodoListState는 내부적으로 2개의 의존성을 
//get을 통해 추적합니다. 그래서 둘 중 하나라도 변하면 
//filteredTodoListState는 다시 실행됩니다.(동적이라)


//필터를 변경하기 위해서 TodoListFilter 컴포넌트를 구현해야한다.
//과연 버튼을 쓸까? 아니면 선택창을 구현할까?

function TodoListFilters(){
  //값을 받아오는 출처는 바로 todolistfilterstate,
  //
  const [filter, setFilter] = useRecoilState(todoListFilterState)

  const updateFilter = ({target : {value}})=>{
    setFilter(value);
  };

  return (
    <>
      Filter:
      <select value={filter} onChange={updateFilter}>
        <option value="Show All">All</option>
        <option value="Show Completed">Completed</option>
        <option value="Show Uncompleted">Uncompleted</option>
      </select>
    </>
  );
}

//통계를 구할 것이다.
//1.todo 항목들의 총 갯수 (todolist의 길이)
//2.완료된 todo 항목들의 총갯수 (todolist isComplete 필터된 길이)
//3.완료되지 않은 todo 항목들의 총갯수 (전체 길이에서 2번 빼기)
//4.완료된 항목의 백분율 (calculate)

//각 통계에 대해 selector를 만들기 보다는, 필요한 데이터를 포함하는 객체를 반환하는
//selector 하나를 만드는 편이 더 좋을 것이다.
const todoListStateState = selector({
  //항상 selector는 객체를 매개변수로 넣어주는 것임을 잊지 말자
  key:'todoListStateState',
  get:({get})=>{
    const todoList = get(todoListState);
    const totalNum = todoList.length;
    const totalCompletedNum = todoList.filter((item)=>item.isComplete).length;
    const totalUncompletedNum = totalNum - totalCompletedNum;
    const percentCompleted = totalNum === 0 ? 0 : totalCompletedNum / totalNum;

    return {
      totalNum,
      totalCompletedNum,
      totalUncompletedNum,
      percentCompleted,
    };
  },
});

function TodoListStatistic(){
  const {
    totalNum,
    totalCompletedNum,
    totalUncompletedNum,
    percentCompleted,
  } = useRecoilValue(todoListStateState);

  //Math.round는 반올림 메서드이다.
  const formattedPrecentCompleted = Math.round(percentCompleted * 100);

  return (
    <ul>
      <li>Total item: {totalNum}</li>
      <li>Item completed: {totalCompletedNum}</li>
      <li>Item uncompleted: {totalUncompletedNum}</li>
      <li>Percent completed: {formattedPrecentCompleted}</li>
    </ul>
  );
}

//여기까지 todo 아이템 추가, todo 아이템 수정
//todo 아이템 삭제, 필터링, 유용한 통계 표시까지의 과정을 마쳤다.

