import LayoutAuthenticated from '../../layouts/authenticated'
import React from 'react'
import type { ReactElement } from 'react'

const UsersPage = () => {
  return (
    <>
      Users
    </>
  )
}

UsersPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default UsersPage
