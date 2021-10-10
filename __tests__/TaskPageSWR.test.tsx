/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom/extend-expect'
import { render, screen, cleanup } from '@testing-library/react'
import { SWRConfig } from 'swr'
import {rest} from "msw"
import { setupServer } from 'msw/node'
import 'setimmediate'

import TaskPage from '../pages/task-page'
import { TASK } from "../types/Types"

const server = setupServer(
  rest.get('https://jsonplaceholder.typicode.com/todos/', (req, res, ctx) => {
    const query = req.url.searchParams
    const _limit = query.get('_limit')
    if (_limit === '10') {
      return res(
        ctx.status(200),
        ctx.json([
          {
            userId: 1,
            id: 1,
            title: 'Task A',
            completed: false,
          },
          {
            userId: 1,
            id: 2,
            title: 'Task B',
            completed: true,
          },
        ])
      )
    }
  })
)
beforeAll(() => {
  server.listen()
})
afterEach(() => {
  server.resetHandlers()
  cleanup()
})
afterEach(() => {
  server.close()
})

describe("task page useSWR: クライアントサイド レンダリングのテスト", () => {
  // mock props
  let staticProps: TASK[]
  staticProps = [
    {
      userId: 3,
      id: 3,
      title: 'Static task C',
      completed: true,
    },
    {
      userId: 4,
      id: 4,
      title: 'Static task D',
      completed: false,
    },
  ]

  it("task page useSWR: クライアントサイドレンダリングの確認", async() => {
    // ダミーデータをセットしてレンダリング実行
    render(
      <SWRConfig value={{dedupingInterval: 0}}>
        <TaskPage staticTasks={staticProps}/>
      </SWRConfig>
    )

    // サーバーサイドで設定した値が表示されていること
    expect(await screen.findByText("Static task C")).toBeInTheDocument()
    expect(screen.getByText("Static task D")).toBeInTheDocument()

    // サーバーサイドで設定した値がクライアントサイドレンダリングの結果で上書きされていること
    expect(await screen.findByText("Task A")).toBeInTheDocument()
    expect(screen.getByText("Task B")).toBeInTheDocument()
  })

  it("task page useSWR: クライアントサイドでのfetchに失敗した場合", async() => {
    server.use(
      rest.get(
        'https://jsonplaceholder.typicode.com/todos/',
        (req, res, ctx) => {
          const query = req.url.searchParams
          const _limit = query.get('_limit')
          if (_limit === '10') {
            return res(ctx.status(400))
          }
        }
      )
    )
    render(
      <SWRConfig value={{dedupingInterval: 0}}>
        <TaskPage staticTasks={staticProps}/>
      </SWRConfig>
    )
    expect(await screen.findByText("Error!")).toBeInTheDocument()
  })
})
