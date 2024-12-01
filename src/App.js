import { Routes, Route, Link, useNavigate } from "react-router-dom";
import About from "./About";
import Missing from "./Missing";
import Home from "./Home";
import NewPost from "./NewPost";
import Post from "./Post";
import PostPage from "./PostPage";
import Header from "./Header";
import Footer from "./Footer";
import Nav from "./Nav";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import api from "./Api/posts";
import EditPost from "./EditPost";

function App() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get("/posts");
        setPosts(response.data);
      } catch (error) {
        if (error.response) {
          console.log("Error fetching posts:", error.response.data);
          console.log(error.response.status);
        } else {
          console.log("Error fetching posts:", error.message);
        }
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    const filteredResults = posts.filter(
      (post) =>
        post.body.toLowerCase().includes(search.toLowerCase()) ||
        post.title.toLowerCase().includes(search.toLowerCase())
    );
    setSearchResult(filteredResults.reverse());
  }, [posts, search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const datetime = format(new Date(), "MMM dd, yyyy pp");
    const newPost = {
      id,
      title: postTitle,
      body: postBody,
      datetime: datetime,
    };
    const reponse = await api.post("posts", newPost);
    const allPosts = [...posts, reponse.data];
    setPosts(allPosts);
    setPostTitle("");
    setPostBody("");
    navigate("/");
  };

  const handleDelete = async (id) => {
    await api.delete(`posts/${id}`);
    const updatedPosts = posts.filter((post) => post.id !== id);
    setPosts(updatedPosts);
    navigate("/");
  };

  const handleEdit = async (id) => {
    const datetime = format(new Date(), "MMMM dd, yyyy pp");
    const updatedPosts = {
      id,
      title: editTitle,
      datatime: datetime,
      body: editBody,
    };
    const response = await api.put(`posts/${id}`, updatedPosts);
    setPosts(
      posts.map((post) => (post.id === id ? { ...response.data } : post))
    );
    setPostTitle("");
    setPostBody("");
    navigate("/");
  };

  return (
    <div className="App">
      <Header title="My Social Media" />
      <Nav search={search} setSearch={setSearch} />
      <Routes>
        <Route path="/" element={<Home posts={searchResult} />} />
        <Route path="post">
          <Route
            index
            element={
              <NewPost
                handleSubmit={handleSubmit}
                postTitle={postTitle}
                setPostTitle={setPostTitle}
                postBody={postBody}
                setPostBody={setPostBody}
              />
            }
          />
          <Route
            path=":id"
            element={
              <PostPage posts={posts} handleDelete={handleDelete}></PostPage>
            }
          ></Route>
        </Route>

        <Route path="/edit/:id" element= {<EditPost
              posts={posts}
              handleEdit={handleEdit}
              editTitle={editTitle}
              setEditTitle={setEditTitle}
              editBody={editBody}
              setEditBody={setEditBody}/>}/>
      
        <Route path="about" element={<About />} />
        <Route path="*" element={<Missing />} />
      </Routes>
      <Footer />
      {/* <PostPage /> */}
    </div>
  );
}

export default App;
