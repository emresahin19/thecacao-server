import ExtraTable from 'lib/components/DataTable/components/extra-table.component'
import LayoutAuthenticated from '../../layouts/authenticated'
import React from 'react'
import type { ReactElement } from 'react'

const ExtraPage = () => {
  return (
    <>
      <ExtraTable />
    </>
  )
}

ExtraPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default ExtraPage
