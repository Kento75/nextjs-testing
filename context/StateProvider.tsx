import React, { useContext, useState, createContext } from "react"

const StateContext = createContext(
  {} as {
    toggle: boolean
    setToggle: React.Dispatch<React.SetStateAction<boolean>>
  }
)

export const StateProvider: React.FC = ({ children }) => {
  const [toggle, setToggle] = useState(false)
  return (
    // グローバル化したい値を設定し、子コンポーネントに値を設定
    <StateContext.Provider value={{ toggle, setToggle }}>
      {children}
    </StateContext.Provider>
  )
}

// 呼び出しもとはこの関数を呼び出すことで上の処理を実行できる
export const useStateContext = () => useContext(StateContext)
