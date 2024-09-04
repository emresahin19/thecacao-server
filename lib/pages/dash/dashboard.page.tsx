import { LayoutAuthenticated } from '@asim-ui/layouts'
import React from 'react'
import type { ReactElement } from 'react'

const DashboardPage = () => {
  return (
    <>
      <div className="container">
          Dashboard
      </div>
    </>
  )
}

DashboardPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default DashboardPage
