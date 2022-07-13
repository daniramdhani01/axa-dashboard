import { API } from '../config/API';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';
import { Container, Table, Card } from "react-bootstrap"
import { UserContext } from '../context/userContext.js';

// components
import NavBar from "../components/Navbar"

// icons
import eye from "../assets/icons/eye.svg"

export default function Albums() {
    const [state, dispatch] = useContext(UserContext)
    const { user } = state.storedata
    const navigate = useNavigate()
    const [albums, setalbums] = useState([])
    const [loading, setloading] = useState(true)

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
                                        <th></th>
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
        </div>
    )
}