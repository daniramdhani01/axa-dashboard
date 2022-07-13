import { useNavigate } from "react-router-dom"
import { API } from "../config/API.js"
import { useState, useEffect, useContext } from "react"
import { Card, Container, Table, Modal, Form, Button } from "react-bootstrap"
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
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [selectcomment, setselectcomment] = useState([{
        id: '',
        name: "",
        email: "",
        body: ""
    }])

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

    const handleSelect = (id) => {
        const array = comments.filter(comment => comment.id === id)
        setselectcomment(array)
        handleShow()
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const data = new FormData(e.target)
        const formData = {
            id: data.get("id"),
            name: data.get("name"),
            email: data.get("email"),
            body: data.get("body")
        }
        setloading(true)
        handleClose()
        API.put(`comments/${selectcomment[0].id}`, formData)
            .then(res => {
                if (res.status != 200) {
                    return alert("Error updating comment")
                }
                // const array = posts.filter(post => post.id !== selectpost[0].id)
                const array = comments.filter(comment => comment.id !== selectcomment[0].id)
                array.push(res.data)
                setcomments(array)
                alert("data has been updated.\nImportant: resource will not be really updated on the server but it will be faked as if.")
            })
            .catch(err => {
                console.log(err)
            }).finally(() => {
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
                                                            <img src={pencil} alt="#" className='icons-crud pointer' onClick={() => handleSelect(comment.id)} />
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
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Patricia Lebsack Post</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>ID Comment</Form.Label>
                            <Form.Control type="text" name="id" defaultValue={selectcomment[0].id} readOnly />
                            {/* <div>{selectcomment[0].id}</div> */}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" name="name" defaultValue={selectcomment[0].name} readOnly />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="text" name="email" defaultValue={selectcomment[0].email} readOnly />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Comment Body</Form.Label>
                            <Form.Control as="textarea" name="body" rows={3} defaultValue={selectcomment[0].body} />
                        </Form.Group>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button type='submit' variant="primary">Save Changes</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div >
    )
}