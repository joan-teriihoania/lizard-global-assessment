type Post = {
    title: string,
    publishDate: string,
    summary: string,
    author: {name: string},
    categories: {name: string}[]
}

export default Post