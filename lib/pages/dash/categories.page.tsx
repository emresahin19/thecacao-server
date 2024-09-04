import { CategoryTable } from '@asim-ui/components'
import { LayoutAuthenticated } from '@asim-ui/layouts'
import React from 'react'
import type { ReactElement } from 'react'

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
