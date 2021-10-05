import { render, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { getPage } from "next-page-tester"
import { initTestHelpers } from 'next-page-tester'
import {rest} from "msw"
import {setupServer} from "msw/node"
import userEvent from '@testing-library/user-event'

// テストinit
initTestHelpers()

// ダミー関数
const handlers = [
  // posts/1 とかの場合にこっちが呼び出されてしまうので、パラメータが一致する場合のみreturnするように変更
  // rest.get(
  //   'https://jsonplaceholder.typicode.com/posts/?_limit=10',
  //   (req, res, ctx) => {
  //     return res(
  //       ctx.status(200),
  //       ctx.json([
  //         {
  //           userId: 1,
  //           id: 1,
  //           title: 'dummy title 1',
  //           body: 'dummy body 1',
  //         },
  //         {
  //           userId: 2,
  //           id: 2,
  //           title: 'dummy title 2',
  //           body: 'dummy body 2',
  //         },
  //       ])
  //     )
  //   }
  // ),
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
  rest.get('https://jsonplaceholder.typicode.com/posts/1', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        userId: 1,
        id: 1,
        title: 'dummy title 1',
        body: 'dummy body 1',
      })
    )
  }),
  rest.get('https://jsonplaceholder.typicode.com/posts/2', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        userId: 2,
        id: 2,
        title: 'dummy title 2',
        body: 'dummy body 2',
      })
    )
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

describe("Blog detail page", () => {
  it("detial page ID 1にアクセスした時のレンダリング確認", async() => {
    const { page } = await getPage({
      route: '/posts/1',
    })
    render(page)
    expect(await screen.findByText('dummy title 1')).toBeInTheDocument()
    expect(screen.getByText('dummy body 1')).toBeInTheDocument()
  })

  it("detial page ID 2にアクセスした時のレンダリング確認", async() => {
    const { page } = await getPage({
      route: '/posts/2',
    })
    render(page)
    expect(await screen.findByText('dummy title 2')).toBeInTheDocument()
    expect(screen.getByText('dummy body 2')).toBeInTheDocument()
  })

  it("detail page からblog pageに戻るルート確認", async() => {
    const { page } = await getPage({
      route: '/posts/2',
    })
    render(page)
    // 表示待ち
    await screen.findByText("dummy title 2")
    // ボタンクリック
    userEvent.click(screen.getByTestId("back-blog"))
    // ブログページへ遷移していることを確認
    expect(await screen.findByText("blog page")).toBeInTheDocument()
  })
})
