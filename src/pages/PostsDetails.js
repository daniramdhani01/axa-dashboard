import { useParams } from "react-router-dom"
import { API } from "../config/API.js"
import { useState, useEffect, useContext } from "react"
import { Card, Container } from "react-bootstrap"
import { UserContext } from '../context/userContext.js';

// components
import NavBar from "../components/Navbar"

export default function PostsDetails() {
    const { id } = useParams()
    const [post, setpost] = useState({})
    const [loading, setloading] = useState(true)
    const [state, dispatch] = useContext(UserContext)
    const user = state.storedata

    const getData = () => {
        API.get(`posts/${id}`)
            .then(res => {
                setpost(res.data)
            }).catch(err => {
                console.log(err)
            }).finally(() => {
                setloading(false)
            })
    }

    useEffect(() => {
        getData()
        return () => {
            setpost({})
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
                            </div>

                        }
                    </Card.Body>
                </Card>
            </Container>
        </div>
    )
}