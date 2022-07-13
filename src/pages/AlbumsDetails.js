import { useNavigate } from "react-router-dom"
import { API } from "../config/API.js"
import { useState, useEffect, useContext } from "react"
import { Card, Container, Table, Modal, Form, Button } from "react-bootstrap"
import { UserContext } from '../context/userContext.js';
import $ from 'jquery';

// components
import NavBar from "../components/Navbar"

// icons
import eye from "../assets/icons/eye.svg"

export default function AlbumsDetails() {
    const navigate = useNavigate()
    const [state, dispatch] = useContext(UserContext)
    const { user, album } = state.storedata
    const [photos, setphotos] = useState([])
    const [loading, setloading] = useState(true)
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [selectphoto, setselectphoto] = useState([{
        id: '',
        title: "",
        url: "",
        thumbnailUrl: ""
    }])

    const handleSelect = (id) => {
        const select = photos.filter(photo => photo.id === id)
        setselectphoto(select)
        handleShow()
    }

    const getPhotos = () => {
        API.get(`photos?albumId=${album.id}`)
            .then(res => {
                setphotos(res.data)
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
        getPhotos()
        return () => {
            setphotos([])
        }
    }, [])
    return (
        <div>
            <NavBar />
            <Container>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <h3>{user.name} Albums</h3>
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
                                        <th>Title</th>
                                        <th>Photos</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {photos.map(photo => (
                                        <tr key={photo.id}>
                                            <td>{photo.title}</td>
                                            <td><img src={photo.thumbnailUrl} alt="" /></td>
                                            <td>
                                                <img src={eye} alt="#" className='icons-crud pointer' onClick={() => handleSelect(photo.id)} />
                                            </td>
                                        </tr>))
                                    }
                                </tbody>
                            </Table>
                        }
                    </Card.Body>
                </Card>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Photos</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="">
                            <img src={selectphoto[0].url} alt="" style={{ width: "100%", maxHeight: "450px", objectFit: "cover" }} />
                            <span>{selectphoto[0].title}</span>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    )
}
