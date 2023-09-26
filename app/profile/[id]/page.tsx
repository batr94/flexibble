
import { UserProfile } from '@/common.types';
import ProfileInfo from '@/components/ProfileInfo';
import { getUserProfile } from '@/lib/actions';

type Props = {
  params: {
    id: string;
  };
};

const ProfilePage = async ({ params: { id } }: Props) => {
  const result = await getUserProfile(id, 100) as { user?: UserProfile };

  if (!result?.user) {
    return (<p className='no-result-text'>Failed to fetch user info</p>)
  }

  return (
    <ProfileInfo user={result?.user} />
  )
}

export default ProfilePage;