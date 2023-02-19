import { client } from "@/features/core/client"
import { GetServerSideProps, InferGetServerSidePropsType } from "next"

export const getServerSideProps = (async (ctx) => {
  const id = ctx.params?.id as string
  const user = await client.users[":id"]
    .$get({ param: { id } })
    .then((r) => r.json())

  return { props: { user } }
}) satisfies GetServerSideProps

const UseShowPage: React.FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ user }) => {
  return <>{JSON.stringify(user, null, 2)}</>
}

export default UseShowPage
