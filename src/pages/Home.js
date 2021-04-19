import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Grid, Transition } from 'semantic-ui-react';
import { AuthContext } from '../context/auth';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { FETCH_POSTS_QUERY } from '../util/graphql';

<style>
@import url('https://fonts.googleapis.com/css2?family=Antonio:wght@100&family=Kaushan+Script&display=swap');
</style>
function Home() {
    const { user } = useContext(AuthContext);
    const { loading, data: { getPosts: posts }={}} = useQuery(FETCH_POSTS_QUERY);
    return (
        <Grid columns={1}>
            <Grid.Row>
                <h1 className="recent">Recent Posts</h1>
            </Grid.Row>
            <Grid.Row>
              {user && (
                <Grid.Column>
                  <PostForm/>
                </Grid.Column>
              )}
            {loading ? (
                <h1>Loading posts...</h1>
            ) : (
                <Transition.Group>
                    {
                        posts && posts.map(post =>(
                            <Grid.Column key={post.id} style={{ marginBottom : 20}}>
                                <PostCard post={post}/>
                            </Grid.Column>
                        ))
                    }
                </Transition.Group>
            )}
            </Grid.Row>
        </Grid>
    )
}


export default Home;
