import { useNavigate } from "react-router-dom"
import { Container, Card, Table } from "react-bootstrap";
import { useState, useEffect, useContext } from "react";
import { API } from "../config/API.js";
import $ from 'jquery';
import { UserContext } from '../context/userContext.js';


// import pages
import NavBar from "../components/Navbar"

document.title = "Home"
export default function Home() {
    const navigate = useNavigate()
    const [users, setusers] = useState([])
    const [loading, setloading] = useState(true)
    const [state, dispatch] = useContext(UserContext)

    const getData = () => {
        API.get("users")
            .then(res => {
                setusers(res.data)
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                setloading(false)
            })
    }

    const handleSelect = (id) => {
        dispatch({
            type: "SET_USER",
            payload: {
                user: users.find(user => user.id === id)
            }
        })
    }

    const handleClickPost = (id) => {
        handleSelect(id)
        navigate("posts")
    }

    const handleClickAlbum = (id) => {
        handleSelect(id)
        navigate("albums")
    }

    $(document).ready(function () {
        $('#example').DataTable();
    });

    useEffect(() => {
        getData()
        return () => {
            setusers([])
        }
    }, [])

    return (
        <div>
            <NavBar />
            <Container>
                <Card className="shadow-sm">
                    <Card.Body>
                        <Card.Title>
                            <h5 className="mb-3">Users</h5>
                        </Card.Title>
                        {loading ?
                            <div className="text-center">
                                <div className="spinner-border text-primary" role="status">
                                </div>
                            </div>
                            :
                            <Table responsive hover id='example' className="display container">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Website</th>
                                        <th>See Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user, index) => {
                                        return (
                                            <tr key={index} >
                                                <td>{index + 1}</td>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>{user.website}</td>
                                                <td>
                                                    <span onClick={() => handleClickPost(user.id)} className="pointer link-primary">
                                                        Posts
                                                    </span >
                                                    ,
                                                    <span className="pointer link-primary" onClick={() => handleClickAlbum(user.id)}>
                                                        Albums
                                                    </span>
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