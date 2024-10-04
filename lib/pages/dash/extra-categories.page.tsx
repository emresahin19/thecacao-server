import ExtraCategoryTable from 'lib/components/DataTable/components/extra-category-table.component'
import LayoutAuthenticated from '../../layouts/authenticated'
import React from 'react'
import type { ReactElement } from 'react'

const ExtraCategoryPage = () => {
  return (
    <>
      <ExtraCategoryTable />
    </>
  )
}

ExtraCategoryPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default ExtraCategoryPage
