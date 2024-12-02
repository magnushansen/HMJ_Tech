import { useRouter } from 'next/router';

const Post = () => {
    const router = useRouter();
    const { sessionId } = router.query;
    return <h1>Post ID: {sessionId}</h1>
}

export default Post;