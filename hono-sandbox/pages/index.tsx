import { client } from "@/features/core/client"
import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import Link from "next/link"

export const getServerSideProps = (async () => {
  const users = await client.users.$get().then((r) => r.json())
  return { props: { users } }
}) satisfies GetServerSideProps

export default function Home({
  users,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div>
      {users.map((user) => (
        <Link href={user.id.toString()} key={user.id}>
          <h2>{user.name}</h2>
        </Link>
      ))}
    </div>
  )
}
