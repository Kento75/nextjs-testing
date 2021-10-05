import { render, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Post from "../components/Post"
import {POST} from "../types/Types"

describe("Post commponent: props確認", () => {
  let dummyProps: POST
  beforeEach(() => {
    dummyProps = {
      userId: 1,
      id: 1,
      title: "dummy title 1",
      body: "dummy body 1",
    }
  })

  it("props内容確認", () => {
    render(<Post {...dummyProps}/>)
    // 渡されたpropsの内容が一致していること
    expect(screen.getByText(dummyProps.id)).toBeInTheDocument()
    expect(screen.getByText(dummyProps.title)).toBeInTheDocument()
  })
})
