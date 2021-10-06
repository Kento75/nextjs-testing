/**
 * @jest-environment jsdom
 */
import {render ,screen} from "@testing-library/react"
import "@testing-library/jest-dom/extend-expect"
import userEvent from "@testing-library/user-event"
import { getPage} from "next-page-tester"
import { initTestHelpers } from "next-page-tester"

// next-page-testerの有効化
initTestHelpers()

describe("Navigation by Link", () => {
  it("should route to selected page in navbar", async() => {
    //--- Arrange

    // ホームページ取得
    const {page} = await getPage({
      route: "/index",
    })
    render(page)

    //--- Act & Assert

    // Navクリック：Blogページへ遷移すること
    userEvent.click(screen.getByTestId("blog-nav"))
    expect(await screen.findByText("blog page")).toBeInTheDocument()
    // DEBUG: DOM内容の出力
    // screen.debug()

    // Navクリック：Commentページへ遷移すること
    userEvent.click(screen.getByTestId("comment-nav"))
    expect(await screen.findByText("comment page")).toBeInTheDocument()

    // Navクリック：Contextページへ遷移すること
    userEvent.click(screen.getByTestId("context-nav"))
    expect(await screen.findByText("context page")).toBeInTheDocument()

    // Navクリック：Todosページへ遷移すること
    userEvent.click(screen.getByTestId("task-nav"))
    expect(await screen.findByText("todos page")).toBeInTheDocument()

    // Navクリック：Homeページへ遷移すること(遷移しない)
    userEvent.click(screen.getByTestId("home-nav"))
    expect(await screen.findByText("Welcome to Nextjs")).toBeInTheDocument()
  })
})
