// import { ProductTable } from 'lib/components'
import LayoutAuthenticated from '../../layouts/authenticated'
import React from 'react'
import type { ReactElement } from 'react'

const ProductPage = () => {
  return (
    <>
      {/* <ProductTable /> */}
    </>
  )
}

ProductPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default ProductPage
