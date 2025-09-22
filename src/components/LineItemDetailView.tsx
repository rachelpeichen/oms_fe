import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchLineItemDetail} from '../services/api';
import type { LineItemDetail } from '../types';
import { formatCurrency } from '../utils/utility';
import {
    Container,
    Row,
    Col,
    Card,
    Spinner,
    Alert,
    Button,
    Breadcrumb,
} from 'react-bootstrap';

const LineItemDetailView = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [lineItem, setLineItem] = useState<LineItemDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadLineItemDetail = async () => {
            if (!id) return;

            try {
                setLoading(true);
                setError(null);
                const data = await fetchLineItemDetail(parseInt(id));
                setLineItem(data);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Failed to fetch line item detail'
                );
            } finally {
                setLoading(false);
            }
        };

        loadLineItemDetail();
    }, [id]);



    if (loading) {
        return (
            <Container className="p-4">
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <p className="mt-2">Loading line item details...</p>
                </div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="p-4">
                <Alert variant="danger">
                    <Alert.Heading>Error!</Alert.Heading>
                    <p>{error}</p>
                    <Button
                        variant="outline-danger"
                        onClick={() => navigate('/')}>
                        Back to Campaigns List
                    </Button>
                </Alert>
            </Container>
        );
    }

    if (!lineItem) {
        return (
            <Container className="p-4">
                <Alert variant="warning">
                    <Alert.Heading>Line Item Not Found</Alert.Heading>
                    <p>The requested line item could not be found.</p>
                    <Button
                        variant="outline-warning"
                        onClick={() => navigate('/')}>
                        Back to Campaigns List
                    </Button>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="p-4">
            <Breadcrumb className="mb-3">
                <Breadcrumb.Item href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
                    Campaigns List
                </Breadcrumb.Item>
                <Breadcrumb.Item href={`/campaigns/${lineItem.campaign_id}`} onClick={(e) => { e.preventDefault(); navigate(`/campaigns/${lineItem.campaign_id}`); }}>
                    Campaign Detail
                </Breadcrumb.Item>
                <Breadcrumb.Item active>
                    LineItem Detail
                </Breadcrumb.Item>
            </Breadcrumb>

            <div className="d-flex justify-content-end align-items-center mb-4">
                <Button
                    variant="outline-secondary"
                    onClick={() =>
                        navigate(`/campaigns/${lineItem.campaign_id}`)
                    }
                    className="me-2">
                    Back to Campaign Detail
                </Button>
                <Button
                    variant="outline-primary"
                    onClick={() => navigate('/')}>
                    Back to Campaigns List
                </Button>
            </div>

            {/* Line Item Information */}
            <Row className="mb-4">
                <Col>
                    <Card>
                        <Card.Header>
                            <h5 className="mb-0">Line Item Information</h5>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <p>
                                    <strong>Line Item ID:</strong> {lineItem.id}
                                </p>
                                <p>
                                    <strong>Name:</strong> {lineItem.name}
                                </p>
                                <p>
                                    <strong>Campaign ID:</strong>{' '}
                                    {lineItem.campaign_id}
                                </p>
                                <p>
                                    <strong>Campaign Name:</strong>{' '}
                                    {lineItem.Campaign.name}
                                </p>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {/* Invoice Information */}
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <h5 className="mb-0">
                                Invoice Information
                                <span className="badge bg-secondary ms-2">
                                    Total {lineItem.Invoice ? 1 : 0} invoice(s)
                                </span>
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            {lineItem.Invoice ? (
                                <div
                                    className="p-3 border rounded"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => navigate(`/invoices/${lineItem.Invoice.id}`)}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <div className="row">
                                        <div className="col-6">
                                            <p className="mb-1">
                                                <strong>Invoice ID:</strong>
                                            </p>
                                            <p className="text-muted">{lineItem.Invoice.id}</p>
                                        </div>
                                        <div className="col-6">
                                            <p className="mb-1">
                                                <strong>Adjustments:</strong>
                                            </p>
                                            <p className="fw-bold text-warning">
                                                {formatCurrency(lineItem.Invoice.adjustments)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-muted">No invoices found for this line item.</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default LineItemDetailView;
