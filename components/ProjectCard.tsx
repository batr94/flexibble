import Image from "next/image";
import Link from "next/link";

type Props = {
  id: string;
  title: string;
  image: string;
  name: string;
  userId: string;
  avatarUrl: string;
};

const ProjectCard = ({
  id,
  title,
  image,
  name,
  userId,
  avatarUrl
}: Props) => {
  return (
    <div className="flexCenter flex-col rounded-2xl drop-shadow-card">
      <Link
        href={`/project/${id}`}
        className="flexCenter group relative w-full h-full"
      >
        <Image
          src={image}
          alt={title}
          width={414}
          height={314}
          className="w-full h-full object-cover rounded-2xl"
        />

        <div className="hidden group-hover:flex profile_card-title">
          <p className="w-full">{ title }</p>
        </div>
      </Link>
      <div className="flexBetween w-full px-2 mt-3 font-semibold text-sm">
        <Link href={`/profile/${userId}`}>
          <div className="flexCenter gap-2">
            <Image
              src={avatarUrl}
              alt="Profile image"
              width={24}
              height={24}
              className="rounded-full"
            />
            <p>{name}</p>
          </div>
        </Link>

        <div className="flexCenter gap-3">
          <div className="flexCenter gap-2">
            <Image
              src='/hearth.svg'
              width={12}
              height={12}
              alt="heart"
            />
            <p className="text-sm">5.2k</p>
          </div>
          <div className="flexCenter gap-2">
            <Image
              src='/eye.svg'
              width={12}
              height={12}
              alt="eye"
            />
            <p className="text-sm">5.2k</p>
          </div>
        </div>
      </div>

    </div>
  )
}

export default ProjectCard