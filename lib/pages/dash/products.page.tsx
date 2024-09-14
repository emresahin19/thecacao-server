// import { ProductTable } from '@asim-ui/components'
import { LayoutAuthenticated } from '@asim-ui/layouts'
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
