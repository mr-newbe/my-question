import { 
  RecoilRoot,
  atom, 
  selector, 
  useRecoilState, 
  useRecoilValue, 
  useSetRecoilState 
} from "recoil";

import {useState,useEffect} from 'react';
import axios from "axios";
export const Bearer = atom(
  {
    key:'Bearer',
    default: '1a5cfa550336f246d80e0b43f8045d003b034002'
  }
)

export const projID = atom(
  {
    key:'projID',
    default:'2315922358'
  }
)

//배열을 담을 전역상태
export const TaskContent = atom(
  {
    key:'TaskContent',
    default:[]
  }
)

//반환될 함수 TaakProvider
export function TaskProvider({children}){

  return (
    <RecoilRoot>
      {children}
    </RecoilRoot>
  );

}

//모듈화를 위해 value와 set 메서드 미리 빼놓기
export function useTasks(){
  return useRecoilValue(TaskContent);
}

export function useContent(){
  return useSetRecoilState(TaskContent);
}


//굳이 여기에 더하기 빼기 등의 작업을 넣을 필요는 없을 것이다.
//다른 페이지에 작성하도록 하자


