/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom/extend-expect"
import {render, screen} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { StateProvider } from "../context/StateProvider"
import ContextA from "../components/ContextA"
import ContextB from "../components/ContextB"

describe("global state(useContext)", () => {
  it("トグル操作後、グローバルstateの値が変わっていること", () => {
    // 事前にstate受け渡しができるよう設定(context-page.tsxの設定と同じ)
    render(
      <StateProvider>
        <ContextA/>
        <ContextB/>
      </StateProvider>
    )
    // 初期値がfalseであること
    expect(screen.getByTestId("toggle-a").textContent).toBe("false")
    expect(screen.getByTestId("toggle-b").textContent).toBe("false")
    // ボタン押下(値変更)
    userEvent.click(screen.getByRole("button"))
    // 変更後の値がtrueであること
    expect(screen.getByTestId("toggle-a").textContent).toBe("true")
    expect(screen.getByTestId("toggle-b").textContent).toBe("true")
  })
})
