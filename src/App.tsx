/* eslint-disable */

import {ReactNode, Suspense, memo, useCallback, useEffect, useState} from 'react';
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
			const newPosts = response.data;
			setPosts(newPosts as unknown as IPost[]);
			setIsLoading(false);
		} catch (error) {
			console.log(error);
		}
	}, []);

	const refetchPosts = async () => {
		await getPosts();
	};

	useEffect(() => {
		getPosts();
	}, [getPosts]);

	if (isLoading) {
		return <div>Посты загружаются</div>;
	}

	return (
		<div className='app'>
			<Suspense fallback={<div>Посты загружаются</div>}>
				{posts.map((post, i) => (
					<Post post={post} key={i} />
				))}
				<Button onClick={refetchPosts}>Обновить посты</Button>
			</Suspense>
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


//Базовый компонент кнопки, считать за имплементацию дефолтного html тега button
const Button = memo(({icon, onClick}: {icon?: ReactNode, onClick: React.MouseEventHandler<HTMLButtonElement>}) => (
	<button className="button" onClick={onClick}>
		{icon}
	</button>
));

export default App;
