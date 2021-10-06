/**
 * @jest-environment jsdom
 */
import { render, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { getPage } from "next-page-tester"
import { initTestHelpers } from 'next-page-tester'
import {rest} from "msw"
import {setupServer} from "msw/node"

// テストinit
initTestHelpers()

// ダミー関数
const handlers = [
  rest.get('https://jsonplaceholder.typicode.com/posts/', (req, res, ctx) => {
    const query = req.url.searchParams
    const _limit = query.get('_limit')
    if (_limit === '10') {
      return res(
        ctx.status(200),
        ctx.json([
          {
            userId: 1,
            id: 1,
            title: 'dummy title 1',
            body: 'dummy body 1',
          },
          {
            userId: 2,
            id: 2,
            title: 'dummy title 2',
            body: 'dummy body 2',
          },
        ])
      )
    }
  }),
]
// ダミーサーバー起動、停止、リセット
const server = setupServer(...handlers)
beforeAll(() => {
  server.listen()
})
afterEach(() => {
  server.resetHandlers()
})
afterAll(() => {
  server.close()
})

// test

describe('Blog page', () => {
  it("getStaticProps: データ取得、DOM生成が正常", async() => {
    const {page} = await getPage({
      route: "/blog-page",
    })
    render(page)
    expect(await screen.findByText("blog page")).toBeInTheDocument()
    expect(screen.getByText("dummy title 1")).toBeInTheDocument()
    expect(screen.getByText("dummy title 2")).toBeInTheDocument()
  })
})
