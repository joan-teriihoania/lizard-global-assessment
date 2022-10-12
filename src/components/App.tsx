import { useEffect, useState } from "react";
import ApiService from "../services/ApiService";
import Table from "./Table";

import { Card, Col, Row } from "react-bootstrap";
import Container from 'react-bootstrap/Container';
import CardHeader from "react-bootstrap/esm/CardHeader";

import Post from "../models/Post"


function App() {
  let [posts, setPosts] = useState<undefined | {[x: string]: any}[]>(undefined)

  useEffect(() => {
    setTimeout(() => {
      ApiService.get("/api/posts", (json: {posts: Post[]}) => {
        setPosts(json.posts.map((post: Post) => {
          return {
            "Title": post.title,
            "Publication date": new Date(post.publishDate).toLocaleDateString(),
            "Summary": post.summary,
            "Author": post.author.name,
            "Categories": post.categories.map((c: {name: string}) => c.name)
          }
        }))
      })
    }, Math.random() * (2*1000));
  }, [])

  return <div>
    <Container className="p-3" fluid>
      <Row>
        <Col>
          <Card>
            <CardHeader>Tableau des données</CardHeader>
            
            <Container className="p-3" fluid>
              {
                posts === undefined ?
                "Please wait a moment..." :
                <Table data={posts}></Table>
              }
            </Container>
          </Card>
        </Col>
      </Row>
    </Container>
  </div>;
}

export default App;
