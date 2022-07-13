import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "datatables.net-dt/css/jquery.dataTables.min.css"
import "datatables.net-dt/js/dataTables.dataTables"
import { Routes, Route } from "react-router-dom"

// import pages
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import Posts from './pages/Posts';
import PostsDetails from './pages/PostsDetails';
import Albums from './pages/Albums';
import AlbumsDetails from './pages/AlbumsDetails';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/posts" element={<Posts />} />
      <Route path="/posts/details" element={<PostsDetails />} />
      <Route path="/albums" element={<Albums />} />
      <Route path="/albums/details" element={<AlbumsDetails />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
