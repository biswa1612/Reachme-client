import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Button, Confirm, Icon} from 'semantic-ui-react';
import { FETCH_POSTS_QUERY } from '../util/graphql';
import MyPopup from '../util/MyPopup';

function DeleteButton({postId, commentId, callback}){
    const [confirmOpen, setConfirmOpen] = useState(false);

    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;
    const [deletePostOrMutation] = useMutation(mutation, {
        update(proxy){
            setConfirmOpen(false);       //post got deleted so closing the confirm by setting it to false
            //we need to remove post from cache so it gets deleted from frontend part 
            if(!commentId){
                const data = proxy.readQuery({
                    query: FETCH_POSTS_QUERY
                });
                // data.getPosts = data.getPosts.filter(p => p.id !== postId);
                proxy.writeQuery({ 
                    query: FETCH_POSTS_QUERY, 
                    data: {
                        getPosts: data.getPosts.filter(p => p.id !== postId),
                    }
                });
            }
            
            if(callback) callback();
        },
        variables: {
            postId,
            commentId
        },
        errorPolicy: 'all'
    })

    return(
    <>
    <MyPopup content={commentId ? 'Delete Comment' : 'Delete Post'}>
      <Button as="div" color="red" floated="right" onClick={() => setConfirmOpen(true)}>
          <Icon name="trash" style={{ margin: 0}}/>
      </Button>
    </MyPopup>
        <Confirm
            open={confirmOpen}
            onCancel={() => setConfirmOpen(false)}      //no to delete the post
            onConfirm={deletePostOrMutation}       //post will be deleted 
        />
    </>
    )
}


const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;
const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;

export default DeleteButton;