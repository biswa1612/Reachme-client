import React from 'react';
import { Button, Form } from 'semantic-ui-react';

import { useForm } from '../util/hooks';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { FETCH_POSTS_QUERY } from '../util/graphql';


function PostForm() {
    const {onChange, onSubmit, values} = useForm(createPostCallback, {
        body: ''
    });

    const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
        variables: values,
        errorPolicy: 'all',             //PASSED to avoid app from breaking
        update(proxy, result){
            const data = proxy.readQuery({            //fetches posts query from cache & data is the root query
                query: FETCH_POSTS_QUERY           //root
            });
            // data.getPosts = [result.data.createPost, ...data.getPosts];
            proxy.writeQuery({                      //writing into getposts present in root query
                query: FETCH_POSTS_QUERY,
                data: {
                  getPosts: [result.data.createPost, ...data.getPosts],  //inside data we have getposts first we are adding the recent post and then spreading the other post
                },
            });
            values.body = '';
        }
    });

    function createPostCallback() {
        createPost();
    }

    return (
        <div>
          <Form onSubmit={onSubmit}>
            <Form.Field>
                <Form.TextArea
                    placeholder="Post your questions..."
                    name="body"
                    onChange={onChange}
                    value={values.body}
                    error={error ? true : false}
                />
                <Button type="submit" color="purple">
                    Post
                </Button>
            </Form.Field>
          </Form>
          {error && (
            <div className="ui error message postform" style={{marginBottom: 20}}>
              <ul className="list">
                  <li>{error.graphQLErrors[0].message}</li>
              </ul>
            </div>
          )}

        </div>
    )
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

export default PostForm;
