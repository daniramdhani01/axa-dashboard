import { useNavigate } from "react-router-dom"
import { API } from "../config/API.js"
import { useState, useEffect, useContext } from "react"
import { Card, Container, Table } from "react-bootstrap"
import { UserContext } from '../context/userContext.js';

// components
import NavBar from "../components/Navbar"

// icons
import minus from "../assets/icons/minus.svg"
import pencil from "../assets/icons/pencil.svg"
import eye from "../assets/icons/eye.svg"

export default function PostsDetails() {
    const navigate = useNavigate()
    const [state, dispatch] = useContext(UserContext)
    const { user, post } = state.storedata
    const [comments, setcomments] = useState([])
    const [loading, setloading] = useState(true)

    const getComments = () => {
        API.get(`comments?postId=${post.id}`)
            .then(res => {
                setcomments(res.data)
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                setloading(false)
            })
    }

    const handleDelete = (id) => {
        setloading(true)
        API.delete(`comments/${id}`)
            .then(res => {
                if (res.status != 200) {
                    return alert("Error deleting comment")
                }
                const array = comments.filter(comment => comment.id !== id)
                setcomments(array)
                alert("data has been deleted.\nImportant: resource will not be really updated on the server but it will be faked as if.")
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setloading(false)
            })
    }

    useEffect(() => {
        getComments()
        return () => {
            setcomments([])
        }
    }, [])
    return (
        <div>
            <NavBar />
            <Container>
                <Card className="shadow-sm">
                    <Card.Body>
                        <Card.Title>
                            <h5 className="mb-3">{user.name} Post Details</h5>
                            <h6 className="mb-3"></h6>
                        </Card.Title>
                        {loading ?
                            <div className="text-center mx-5">
                                <div className="spinner-border text-primary" role="status">
                                </div>
                            </div>
                            :
                            <div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Title</label>
                                            <input type="text" className="form-control" value={post.title} disabled />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Body</label>
                                            <textarea className="form-control" rows="3" value={post.body} disabled></textarea>
                                        </div>
                                    </div>
                                </div>
                                <h5>
                                    Comments
                                </h5>
                                <Table responsive hover id='example' className="display container">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Name</th>
                                            <th>Comment Body</th>
                                            <th>Email</th>
                                            <th>Id</th>
                                            <th style={{ width: "10%" }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {comments.map((comment, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{comment.name}</td>
                                                    <td>{comment.body}</td>
                                                    <td>{comment.email}</td>
                                                    <td>{comment.id}</td>
                                                    <td>
                                                        <div className='d-flex justify-content-between'>
                                                            <img src={pencil} alt="#" className='icons-crud pointer' />
                                                            <img src={minus} alt="#" className='icons-crud pointer' onClick={() => handleDelete(comment.id)} />
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        }
                    </Card.Body>
                </Card>
            </Container>
        </div >
    )
}