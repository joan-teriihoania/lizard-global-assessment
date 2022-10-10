import { useEffect, useState } from "react";
import ApiService from "../services/ApiService";
import Table from "./Table";

function App() {
  let [posts, setPosts] = useState(undefined)

  useEffect(() => {
    setTimeout(() => {
      ApiService.get("/api/posts", (json) => {
        setPosts(json.posts.map((post) => {
          return {
            "Titre": post.title,
            "Publié le": post.publishDate,
            "Résumé": post.summary.substring(0, Math.min(post.summary.length, 200) + (post.summary.length > 200 ?? "...")),
            "Auteur": post.author.name,
            "Catégories": post.categories.map((c) => c.name).join(", ")
          }
        }))
      })
    }, Math.random() * 1000);
  }, [])

  return <div>
    {
      posts === undefined ?
      "Please wait a moment..." :
      <Table data={posts}></Table>
    }
  </div>;
}

export default App;
