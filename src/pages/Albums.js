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

export default function Albums() {
    const [state, dispatch] = useContext(UserContext)
    const { user } = state.storedata
    const navigate = useNavigate()
    const [show, setShow] = useState(false)
    const [albums, setalbums] = useState([])
    const [selectalbum, setselectalbum] = useState([{
        title: "",
        body: ""
    }])
    const [loading, setloading] = useState(true)
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const getAlbums = () => {
        API.get(`albums?userId=${user.id}`)
            .then(res => {
                setalbums(res.data)
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                setloading(false)
            })
    }

    const handleDelete = (id) => {
        setloading(true)
        API.delete(`albums/${id}`)
            .then(res => {
                if (res.status != 200) {
                    return alert("Error deleting album")
                }
                const array = albums.filter(album => album.id !== id)
                setalbums(array)
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
        const array = albums.filter(album => album.id === id)
        dispatch({
            type: "SET_ALBUM",
            payload: {
                user,
                album: array[0]
            }
        })
        navigate(`/albums/details`)
    }

    const handleSelect = (id) => {
        const select = albums.filter(album => album.id === id)
        setselectalbum(select)
        handleShow()
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const data = new FormData(e.target)
        const formData = {
            title: data.get("title")
        }
        setloading(true)
        handleClose()
        API.put(`albums/${selectalbum[0].id}`, formData)
            .then(res => {
                if (res.status != 200) {
                    return alert("Error updating album")
                }
                const array = albums.filter(album => album.id !== selectalbum[0].id)
                array.push(res.data)
                setalbums(array)
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
        getAlbums()
        return () => {
            setalbums([])
        }
    }, [])

    return (
        <div>
            <NavBar />
            <Container>
                <Card className="shadow-sm">
                    <Card.Body>
                        <Card.Title>
                            <h5 className="mb-3">{user.name} Album List</h5>
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
                                        <th>album Id</th>
                                        <th style={{ width: "10%" }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {albums.map((album, index) => {
                                        return (
                                            <tr key={index} >
                                                <td>{index + 1}</td>
                                                <td>{album.title}</td>
                                                <td>{album.id}</td>
                                                <td>
                                                    <div className='d-flex justify-content-between'>
                                                        <img src={eye} alt="#" className='icons-crud pointer' onClick={() => { handleClick(album.id) }} />
                                                        <img src={pencil} alt="#" className='icons-crud pointer' onClick={() => handleSelect(album.id)} />
                                                        <img src={minus} alt="#" className='icons-crud pointer' onClick={() => { handleDelete(album.id) }} />
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
                        <Modal.Title>{user.name} Album</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" name="title" defaultValue={selectalbum[0].title} />
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