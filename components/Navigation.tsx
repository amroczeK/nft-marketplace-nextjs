import React from 'react'
import Link from './NextLink'

export default function Navigation() {
  return (
    <nav className="border-b p-6">
      <ul>
        <h1 className="text-4xl font-bold">NFT Marketplace</h1>

        <ul className="mt-4 flex">
          <li>
            <Link href="/">
              <a className="mr-6">Home</a>
            </Link>
          </li>
          <li>
            <Link href="/sell">
              <a className="mr-6">Sell Digital Asset</a>
            </Link>
          </li>
          <li>
            <Link href="/assets">
              <a className="mr-6">My Digital Assets</a>
            </Link>
          </li>
          <li>
            <Link href="/dashboard">
              <a className="mr-6">Creator Dashboard</a>
            </Link>
          </li>
        </ul>
      </ul>
    </nav>
  )
}
