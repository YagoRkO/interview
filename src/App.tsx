/* eslint-disable */

import {ReactNode, memo, useCallback, useEffect, useState} from 'react';
import './App.css';
import axios from 'axios';

interface IPost {
	userId: number;
	id: number;
	title: string;
	body: string;
}

function App() {
	const [posts, setPosts] = useState();
	const [isLoading, setIsLoading] = useState(false);

	const getPosts = useCallback(async () => {
		try {
			setIsLoading(true);
			const response = await axios.get(
				"https://jsonplaceholder.typicode.com/posts"
			);
			const newPosts = await response.data;
			setPosts(newPosts as unknown as IPost[]);
			setIsLoading(false);
		} catch (error) {
			console.log(error);
		}
	}, []);

	useEffect(() => {
		getPosts();
	}, [getPosts]);

	if (isLoading) {
		return <div>Посты загружаются</div>;
	}

	return (
		<div className='app'>
			{posts.map((post, i) => (
				<Post post={post} key={i} />
			))}
		</div>
	);
}

const Post = memo(({post}: {post: IPost}) => {
	const [likes, setLikes] = useState();
	const icon = (
		<div>
			<div>💖</div>
			{likes}
		</div>
	);

	const handleLike = useCallback(() => {
		const newLikes = likes + 1;
		setLikes(newLikes);
	}, []);

	return (
		<div className='post'>
			<div className="container">
				<div className='title'>{post.title}</div>
				<div className='body'>{post.body}</div>
			</div>
			<div className="container">
				<Button icon={icon} onClick={handleLike}/>
			</div>
		</div>
	);
});

const Button = ({icon, onClick}: {icon: ReactNode, onClick: () => void}) => (
	<button className="button" onClick={onClick}>
		{icon}
	</button>
);

export default App;
