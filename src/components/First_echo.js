import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue
} from 'recoil';
import React from 'react';


const textState = atom({
  key : 'textState',
  default : '',
})

export function CharactorCounter(){
  return (
    <div>
      <RecoilRoot>
        <TextInput/>
        <CharactorChecker/>
      </RecoilRoot>
    </div>
  )
}

function TextInput(){
  const [text, setText] = useRecoilState(textState);

  const onChange = (event)=>{
    setText(event.target.value);
  };

  return (
    <div>
      <input type='text' value={text} onChange={onChange}/>
      <br/>
      Echo: {text}
    </div>
  )
}


const charCountState = selector({
  key:'charCountState',
  get:({get})=>{
    const text = get(textState);

    return text.length;
  }
});

function CharactorChecker(){
  const count = useRecoilValue(charCountState);

  return <>Charactor Count: {count}</>
}
