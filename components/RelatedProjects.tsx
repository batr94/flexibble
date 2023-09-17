import { UserProfile } from "@/common.types";
import { getUserProfile } from "@/lib/actions";
import Link from "next/link";
import Image from "next/image";

type Props = {
  userId: string;
  projectId: string;
};

const RelatedProjects = async ({ userId, projectId}: Props) => {
  const { user } = await getUserProfile(userId) as { user: UserProfile};
  const filteredProjects = user?.projects?.edges?.filter(
    ({ node }) => node?.id !== projectId
  );

  if (filteredProjects?.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col mt-32 w-full">
      <div className="flexBetween">
        <p className="text-base font-bold">More by {user?.name}</p>
        <Link
          href={`/profile/${user?.id}`}
          className="text-primary-purple text-base"
        >
          View all
        </Link>
      </div>
      <div className="related_projects-grid">
        {filteredProjects.map(({node}) => (
          <div className="flexCenter related_projects-card drop-shadow-card">
            <Link
              href={`/project/${node?.id}`}
              className='flexCenter group relative w-full h-full'
            >
              <Image
                src={node?.image}
                width={413}
                height={314}
                alt="Project image"
                className="w-full h-full object-cover rounded-2xl"
              />

              <div className="related_project-card_title hidden group-hover:flex">
                <p className="w-full">{node?.title}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}

export default RelatedProjects