// import { CategoryTable } from 'lib/components'
import LayoutAuthenticated from '../../layouts/authenticated'
import React from 'react'
import type { ReactElement } from 'react'

const CategoriesPage = () => {
  return (
    <>
      {/* <CategoryTable /> */}
    </>
  )
}

CategoriesPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default CategoriesPage
