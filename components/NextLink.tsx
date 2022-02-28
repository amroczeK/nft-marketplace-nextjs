import Link from 'next/link'

export default function NextLink({
  href,
  children,
  ...rest
}: {
  href: any
  children?: any
  rest?: any
  target?: any
}) {
  return (
    <Link href={href}>
      <a {...rest}>{children}</a>
    </Link>
  )
}
