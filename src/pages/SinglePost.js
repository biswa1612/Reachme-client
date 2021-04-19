import React, {useContext, useState } from "react";
import gql from "graphql-tag";
import {useQuery, useMutation} from '@apollo/react-hooks';
import { Button, Card, Form, Grid, Icon, Image, Label, TextArea } from "semantic-ui-react";
import moment from 'moment';

import { AuthContext } from '../context/auth';
import LikeButton from "../components/LikeButton";
import DeleteButton from "../components/DeleteButton";
import MyPopup from '../util/MyPopup';
import '../stylesheet/SinglePost.css';
function SinglePost(props) {
  const postId = props.match.params.postId;
  const { user } = useContext(AuthContext);
 

  const [comment, setComment] = useState('');
  const { data: { getPost } = {}} = useQuery(FETCH_POST_QUERY, {
    variables : {
      postId
    }
  });
  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment('');   //after submitting we are making the input empty
    },
    variables: {
      postId,
      body: comment
    }
  });
function deletePostCallback() {
  props.history.push('/')
}

  let postMarkup;
  if(!getPost){
    postMarkup = <p>Loading post...</p>
  } else {
    const { id, body, createdAt, username, comments, likes, likeCount, commentCount} = getPost;

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              float='right'
              size='small'
              src='https://semantic-ui.com/images/avatar2/large/elyse.png'
            />
          </Grid.Column>
          <Grid.Column width={13}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr/>
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likeCount, likes}}/>
                <MyPopup content="Comment on post">
                  <Button 
                    as="div"
                    labelPosition="right"
                    onClick={() => console.log('Comment on Post')}
                  >
                      <Button basic color="blue">
                        <Icon name="comments"/>
                      </Button>
                      <Label basic color="blue" pointing="left">
                        {commentCount}
                      </Label>
                  </Button>
                </MyPopup>

                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deletePostCallback}/>
                )}
              </Card.Content>
            </Card>
            {user && <Card fluid style={{marginTop: 10}}>
              <Card.Content>
                {/* <p>Post a Comment</p> */}
                <Form>
                    {/* <div className="ui action input fluid"> */}
                      <TextArea
                      fluid
                        type="text"
                        placeholder="Post your comments.."
                        name="comment"
                        value={comment}
                        onChange={event => setComment(event.target.value)}
                        className="postcomment"
                        style={{height: 70}}
                      />
                      <button type="submit"
                        className="ui button purple singlepost"
                        disabled={comment.trim() === ''}
                        onClick={submitComment}
                      >
                        Submit
                      </button>
                    {/* </div> */}
                </Form>
              </Card.Content>
              </Card>}
            {comments.map(comment => (
              <Card fluid key={comment.id} style={{marginTop: 15}}>
                <Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
  return postMarkup;
}
const SUBMIT_COMMENT_MUTATION = gql`
    mutation($postId: String!, $body: String!){
        createComment(postId: $postId, body: $body){
            id
            comments{
                id body createdAt username
            }
            commentCount
        }
    }
`
const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default SinglePost;
