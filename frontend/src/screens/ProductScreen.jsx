import React, {useState} from "react"
import { Col, Row, Image, ListGroup, Card, Button, ListGroupItem, Form} from "react-bootstrap"
import { useGetProductDetailsQuery } from "../slices/productApiSclice"
import { useDispatch } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import Rating from "../components/Rating"
import Message from "../components/Message";
import { addToCart } from '../slices/cartSlice'

const ProductScreen = () => {

    const {id: productId} = useParams();
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const {data: product, isLoading, error} = useGetProductDetailsQuery(productId);

    const addToCartHandler = () => {
        dispatch(addToCart({ ...product, qty }));
        navigate('/cart')
    }

    const [qty, setQty] = useState(1);

    
    // console.log( [...Array(product.countInStock).keys()] );
    return (
        <>
        <Link className="btn btn-light my-3" to={'/'}>Go Back</Link>
        {isLoading? (
            <Loader />
            ) : error ? (
                <Message variant='danger'>{
                    (<div>{error?.data?.message || error?.error}</div>)
                }</Message>) : (
            <Row>
                <Col md={5}>
                    <Image src={product.image} alt={product.name} fluid />
                </Col>
                <Col md={4}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h3>{product.name}</h3>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Rating value={product.value} text={`${product.numReviews} reviews`} />
                        </ListGroup.Item>
                        <ListGroup.Item>
                            Price: ${product.price}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={3}>
                    <Card>
                        <ListGroup variant="flush">
                            <ListGroupItem>
                                <Row>
                                    <Col>Price</Col>
                                    <Col>
                                        <strong>
                                            {product.price}
                                        </strong>
                                    </Col>
                                </Row>
                            </ListGroupItem>
                            <ListGroupItem>
                                <Row>
                                    <Col>Status</Col>
                                    <Col>{product.countInStock ? 'In Stock' : 'Out Of Stock'}</Col>
                                </Row>
                            </ListGroupItem>

                            {
                                product.countInStock > 0 && (
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Qty</Col>
                                        <Col>
                                        <Form.Control
                                        as={'select'}
                                        value={qty}
                                        onChange={(e) => setQty(Number(e.target.value))}
                                        >
                                            {[...Array(product.countInStock).keys()].map((x) => (
                                                <option key={x + 1} value={x + 1}>
                                                    {x + 1}
                                                </option>
                                            ))}
                                        </Form.Control>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>)
                            }
                            
                            <ListGroupItem>
                                <Button
                                    className="btn-block"
                                    type="button"
                                    disabled={product.countInStock === 0}
                                    onClick={addToCartHandler}
                                >
                                    Add To Cart
                                </Button>
                            </ListGroupItem>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        )}
       
        </>
    )
}

export default ProductScreen