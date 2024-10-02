import LayoutAuthenticated from '../../layouts/authenticated'
import React from 'react'
import type { ReactElement } from 'react'
import CategoryTable from '../../components/DataTable/components/category-table.component'

const CategoriesPage = () => {
  return (
    <>
      <CategoryTable />
    </>
  )
}

CategoriesPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default CategoriesPage
