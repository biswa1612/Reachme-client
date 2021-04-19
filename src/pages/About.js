import React from 'react'
import { Message } from 'semantic-ui-react'

const About = () => (
  <Message color="black" size="large">
    <Message.Header>ReachMe</Message.Header>
    <>
    <p style={{marginTop: 18}}>
      This website is a question and answer site for enthusiast programmers who are always willing to improve themselves.
      You can post any sort of questions in which you're stuck and one's those who know the answer can help in the comment section.
    </p>
    <p>
      Future updates will be released soon
    </p>
    </>
  </Message>
)

export default About;