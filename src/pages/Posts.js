import { API } from '../config/API';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';
import { Container, Table, Card, Modal, Button, Form } from "react-bootstrap"
import { UserContext } from '../context/userContext.js';

// components
import NavBar from "../components/Navbar"

// icons
import minus from "../assets/icons/minus.svg"
import pencil from "../assets/icons/pencil.svg"
import eye from "../assets/icons/eye.svg"

export default function Posts() {
    const [state, dispatch] = useContext(UserContext)
    const { user } = state.storedata
    const navigate = useNavigate()
    const [show, setShow] = useState(false)
    const [posts, setposts] = useState([])
    const [selectpost, setselectpost] = useState([{
        title: "",
        body: ""
    }])
    const [loading, setloading] = useState(true)
    const [form, setForm] = useState({
        title: "",
        body: "",
    })
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const getPosts = () => {
        API.get(`posts?userId=${user.id}`)
            .then(res => {
                setposts(res.data)
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                setloading(false)
            })
    }

    const handleDelete = (id) => {
        setloading(true)
        API.delete(`posts/${id}`)
            .then(res => {
                if (res.status != 200) {
                    return alert("Error deleting post")
                }
                const array = posts.filter(post => post.id !== id)
                setposts(array)
                alert("data has been deleted.\nImportant: resource will not be really updated on the server but it will be faked as if.")
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setloading(false)
            })
    }

    const handleClick = (id) => {
        const array = posts.filter(post => post.id === id)
        dispatch({
            type: "SET_POST",
            payload: {
                user,
                post: array[0]
            }
        })
        navigate(`/posts/details`)
    }

    const handleSelect = (id) => {
        const select = posts.filter(post => post.id === id)
        setselectpost(select)
        handleShow()
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm({
            ...form,
            [name]: value
        })
    }


    const handleSubmit = (e) => {
        e.preventDefault()
        const data = new FormData(e.target)
        const formData = {
            title: data.get("title"),
            body: data.get("body")
        }
        setloading(true)
        handleClose()
        API.put(`posts/${selectpost[0].id}`, formData)
            .then(res => {
                if (res.status != 200) {
                    return alert("Error updating post")
                }
                const array = posts.filter(post => post.id !== selectpost[0].id)
                array.push(res.data)
                setposts(array)
                alert("data has been updated.\nImportant: resource will not be really updated on the server but it will be faked as if.")
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                setloading(false)
            })
    }


    $(document).ready(function () {
        $('#example').DataTable();
    });


    useEffect(() => {
        getPosts()
        return () => {
            setposts([])
        }
    }, [])

    return (
        <div>
            <NavBar />
            <Container>
                <Card className="shadow-sm">
                    <Card.Body>
                        <Card.Title>
                            <h5 className="mb-3">{user.name} Post List</h5>
                        </Card.Title>
                        {loading ?
                            <div className="text-center my-5">
                                <div className="spinner-border text-primary" role="status">
                                </div>
                            </div>
                            :
                            <Table responsive hover id='example' className="display container">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Title</th>
                                        <th>Body</th>
                                        <th>PostId</th>
                                        <th style={{ width: "10%" }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {posts.map((post, index) => {
                                        return (
                                            <tr key={index} >
                                                <td>{index + 1}</td>
                                                <td>{post.title}</td>
                                                <td>{post.body}</td>
                                                <td>{post.id}</td>
                                                <td>
                                                    <div className='d-flex justify-content-between'>
                                                        <img src={eye} alt="#" className='icons-crud pointer' onClick={() => { handleClick(post.id) }} />
                                                        <img src={pencil} alt="#" className='icons-crud pointer' onClick={() => handleSelect(post.id)} />
                                                        <img src={minus} alt="#" className='icons-crud pointer' onClick={() => { handleDelete(post.id) }} />
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    }
                                    )
                                    }
                                </tbody>
                            </Table>
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
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" name="title" defaultValue={selectpost[0].title} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Body</Form.Label>
                            <Form.Control as="textarea" name="body" rows={3} defaultValue={selectpost[0].body} />
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
        </div>
    )
}