import { ProductTable } from '@asim-ui/components'
import { LayoutAuthenticated } from '@asim-ui/layouts'
import Head from 'next/head'
import React, { useState } from 'react'
import type { ReactElement } from 'react'

const ProductPage = () => {
  return (
    <>
      <ProductTable />
    </>
  )
}

ProductPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default ProductPage
